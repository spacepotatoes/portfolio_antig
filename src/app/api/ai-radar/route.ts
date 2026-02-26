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
  category: 'models' | 'tools' | 'opensource';
}

const FEEDS = [
  { url: 'https://huggingface.co/blog/feed.xml', source: 'Hugging Face' },
  { url: 'https://www.anthropic.com/rss.xml', source: 'Anthropic' },
  { url: 'https://openai.com/blog/rss.xml', source: 'OpenAI' },
  { url: 'https://deepmind.google/blog/rss.xml', source: 'Google DeepMind' },
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge AI' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch AI' },
  { url: 'https://mistral.ai/news/rss.xml', source: 'Mistral AI' },
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

function parseXML(xml: string, sourceName: string): FeedItem[] {
  const items: FeedItem[] = [];

  // Normalize CDATA
  const normalized = xml.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, content) =>
    content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  );

  // Support both <item> (RSS) and <entry> (Atom)
  const itemRegex = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g;
  let match;

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

    if (!title || !url) continue;

    let pubDate = new Date();
    if (pubDateRaw) {
      const parsed = new Date(pubDateRaw);
      if (!isNaN(parsed.getTime())) pubDate = parsed;
    }

    const dateStr = pubDate.toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const summary = description.slice(0, 280) + (description.length > 280 ? '…' : '');
    const category = categorize(title, description);
    const tags = extractTags(title, description);

    items.push({ title, summary, source: sourceName, url, tags, date: dateStr, pubDate, category });
  }

  return items;
}

async function fetchFeed(feedUrl: string, sourceName: string): Promise<FeedItem[]> {
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
    return parseXML(xml, sourceName);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const results = await Promise.all(
    FEEDS.map(f => fetchFeed(f.url, f.source))
  );

  const allItems = results
    .flat()
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allItems.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  const models = unique.filter(i => i.category === 'models').slice(0, 12);
  const tools = unique.filter(i => i.category === 'tools').slice(0, 12);
  const opensource = unique.filter(i => i.category === 'opensource').slice(0, 12);

  // Strip pubDate (not serializable as Date in JSON, already have date string)
  const strip = (items: FeedItem[]) => items.map(({ pubDate: _, ...rest }) => rest);

  return NextResponse.json(
    { models: strip(models), tools: strip(tools), opensource: strip(opensource) },
    { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' } }
  );
}
