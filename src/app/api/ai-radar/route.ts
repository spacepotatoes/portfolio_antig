import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 900; // 15 minutes

interface FeedItem {
  title: string;
  summary: string;
  source: string;
  url: string;
  tags: string[];
  date: string;
  pubDate: Date;
  category: 'models' | 'tools' | 'opensource' | 'graphicdesign' | 'webdesign';
  image?: string;
}

const AI_FEEDS = [
  { url: 'https://huggingface.co/blog/feed.xml', source: 'Hugging Face' },
  { url: 'https://www.anthropic.com/rss.xml', source: 'Anthropic' },
  { url: 'https://openai.com/blog/rss.xml', source: 'OpenAI' },
  { url: 'https://deepmind.google/blog/rss.xml', source: 'Google DeepMind' },
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge AI' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch AI' },
  { url: 'https://mistral.ai/news/rss.xml', source: 'Mistral AI' },
];

const GRAPHIC_DESIGN_FEEDS = [
  { url: 'https://www.creativebloq.com/rss', source: 'Creative Bloq' },
  { url: 'https://www.itsnicethat.com/rss', source: "It's Nice That" },
  { url: 'https://www.designboom.com/feed/', source: 'Designboom' },
  { url: 'https://www.awwwards.com/blog/feed/', source: 'Awwwards' },
];

const WEBDESIGN_FEEDS = [
  { url: 'https://www.smashingmagazine.com/feed/', source: 'Smashing Magazine' },
  { url: 'https://css-tricks.com/feed/', source: 'CSS-Tricks' },
  { url: 'https://tympanus.net/codrops/feed/', source: 'Codrops' },
  { url: 'https://alistapart.com/main/feed/', source: 'A List Apart' },
];

const MODEL_KEYWORDS = [
  'model', 'llm', 'gpt', 'claude', 'gemini', 'llama', 'mistral', 'release',
  'benchmark', 'multimodal', 'image generation', 'video generation', 'audio',
  'foundation model', 'language model', 'diffusion', 'flux', 'sora',
];

const TOOL_KEYWORDS = [
  'tool', 'app', 'api', 'product', 'launch', 'update', 'feature', 'copilot',
  'cursor', 'perplexity', 'midjourney', 'runway', 'elevenlabs', 'assistant',
  'plugin', 'integration', 'platform', 'service', 'sdk', 'agent',
];

const OPENSOURCE_KEYWORDS = [
  'open source', 'open-source', 'github', 'hugging face', 'arxiv', 'paper',
  'repo', 'repository', 'weights', 'checkpoint', 'fine-tuning', 'finetuning',
  'dataset', 'research', 'preprint', 'stars', 'trending',
];

function categorize(title: string, description: string): 'models' | 'tools' | 'opensource' {
  const text = (title + ' ' + description).toLowerCase();

  const modelScore = MODEL_KEYWORDS.filter(k => text.includes(k)).length;
  const toolScore = TOOL_KEYWORDS.filter(k => text.includes(k)).length;
  const opensourceScore = OPENSOURCE_KEYWORDS.filter(k => text.includes(k)).length;

  if (opensourceScore >= modelScore && opensourceScore >= toolScore) return 'opensource';
  if (modelScore >= toolScore) return 'models';
  return 'tools';
}

function extractTags(title: string, description: string): string[] {
  const text = (title + ' ' + description).toLowerCase();
  const tagCandidates = [
    'GPT-4', 'Claude', 'Gemini', 'Llama', 'Mistral', 'FLUX', 'Sora',
    'Open Source', 'Research', 'API', 'Multimodal', 'Fine-tuning',
    'Benchmark', 'Agent', 'RAG', 'LLM', 'Vision',
  ];
  return tagCandidates.filter(t => text.includes(t.toLowerCase())).slice(0, 3);
}

function extractImage(block: string): string {
  // media:content url attribute (most common in news feeds)
  const m1 = block.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (m1) return m1[1];

  // media:thumbnail
  const m2 = block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
  if (m2) return m2[1];

  // enclosure with image type
  const m3 = block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i);
  if (m3) return m3[1];

  // enclosure with image extension (type might come before url)
  const m4 = block.match(/<enclosure[^>]+url=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/i);
  if (m4) return m4[1];

  // img tag in raw block (not inside CDATA)
  const m5 = block.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m5) return m5[1];

  return '';
}

function parseXML(xml: string, sourceName: string, forcedCategory?: 'graphicdesign' | 'webdesign'): FeedItem[] {
  const items: FeedItem[] = [];

  // Normalize CDATA
  const normalized = xml.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, content) =>
    content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  );

  // Extract images from raw XML (before CDATA normalization escapes img tags)
  const rawItemRegex = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g;
  const rawImages: string[] = [];
  let rawMatch;
  while ((rawMatch = rawItemRegex.exec(xml)) !== null) {
    rawImages.push(extractImage(rawMatch[1]));
  }

  // Support both <item> (RSS) and <entry> (Atom)
  const itemRegex = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g;
  let match;
  let itemIndex = 0;

  while ((match = itemRegex.exec(normalized)) !== null) {
    const block = match[1];

    const getTag = (tag: string): string => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      if (!m) return '';
      return m[1]
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/<[^>]+>/g, '')
        .trim();
    };

    const getLinkAtom = (): string => {
      const m = block.match(/<link[^>]+href=["']([^"']+)["']/i);
      return m ? m[1] : '';
    };

    const title = getTag('title');
    const description = getTag('description') || getTag('summary') || getTag('content');
    const url = getTag('link') || getLinkAtom();
    const pubDateRaw = getTag('pubDate') || getTag('published') || getTag('updated') || getTag('dc:date');

    if (!title || !url) { itemIndex++; continue; }

    let pubDate = new Date();
    if (pubDateRaw) {
      const parsed = new Date(pubDateRaw);
      if (!isNaN(parsed.getTime())) pubDate = parsed;
    }

    const dateStr = pubDate.toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const summary = description.slice(0, 280) + (description.length > 280 ? '…' : '');
    const category = forcedCategory ?? categorize(title, description);
    const tags = forcedCategory ? [] : extractTags(title, description);

    // Use raw image (before CDATA normalization) if available
    const image = rawImages[itemIndex] || extractImage(block) || undefined;

    items.push({ title, summary, source: sourceName, url, tags, date: dateStr, pubDate, category, image });
    itemIndex++;
  }

  return items;
}

async function fetchFeed(feedUrl: string, sourceName: string, forcedCategory?: 'graphicdesign' | 'webdesign'): Promise<FeedItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(feedUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AIRadar/1.0)' },
      next: { revalidate: 900 },
    });

    if (!res.ok) return [];
    const xml = await res.text();
    return parseXML(xml, sourceName, forcedCategory);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function deduplicate(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>();
  return items.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

export async function GET() {
  const [aiResults, graphicResults, webResults] = await Promise.all([
    Promise.all(AI_FEEDS.map(f => fetchFeed(f.url, f.source))),
    Promise.all(GRAPHIC_DESIGN_FEEDS.map(f => fetchFeed(f.url, f.source, 'graphicdesign'))),
    Promise.all(WEBDESIGN_FEEDS.map(f => fetchFeed(f.url, f.source, 'webdesign'))),
  ]);

  const aiItems = deduplicate(
    aiResults.flat().sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
  );
  const graphicItems = deduplicate(
    graphicResults.flat().sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
  );
  const webItems = deduplicate(
    webResults.flat().sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
  );

  const models = aiItems.filter(i => i.category === 'models').slice(0, 12);
  const tools = aiItems.filter(i => i.category === 'tools').slice(0, 12);
  const opensource = aiItems.filter(i => i.category === 'opensource').slice(0, 12);
  const graphicdesign = graphicItems.slice(0, 12);
  const webdesign = webItems.slice(0, 12);

  // Strip pubDate before serializing
  const strip = (items: FeedItem[]) => items.map(({ pubDate: _, ...rest }) => rest);

  return NextResponse.json(
    {
      models: strip(models),
      tools: strip(tools),
      opensource: strip(opensource),
      graphicdesign: strip(graphicdesign),
      webdesign: strip(webdesign),
    },
    { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' } }
  );
}
