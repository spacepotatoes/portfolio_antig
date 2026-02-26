'use server'

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createMistral } from '@ai-sdk/mistral';
import { getAISettings } from '@/lib/ai-settings';
import { auth } from '@clerk/nextjs/server';

const FETCH_HEADERS = { 'User-Agent': 'Mozilla/5.0 (compatible; Portfolio-Bot/1.0)' };
const SKIP_EXTENSIONS = /\.(pdf|jpg|jpeg|png|gif|svg|webp|mp4|zip|css|js|xml|json)$/i;

async function fetchSinglePage(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: FETCH_HEADERS,
            signal: AbortSignal.timeout(8000),
        });
        const html = await response.text();
        return html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 3000);
    } catch {
        return '';
    }
}

function extractInternalLinks(html: string, baseUrl: URL): string[] {
    const linkRegex = /href="([^"#?]+)"/g;
    const seen = new Set<string>();
    const links: string[] = [];
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        try {
            const href = match[1];
            if (SKIP_EXTENSIONS.test(href)) continue;
            const link = new URL(href, baseUrl.origin);
            if (link.hostname === baseUrl.hostname && link.href !== baseUrl.href && !seen.has(link.href)) {
                seen.add(link.href);
                links.push(link.href);
            }
        } catch { /* skip invalid URLs */ }
    }
    return links;
}

function extractImages(html: string, baseUrl: URL): string[] {
    const images: string[] = [];
    const seen = new Set<string>();

    // OG / Twitter meta images
    const metaRegex = /<meta[^>]+(?:property="og:image"|name="twitter:image")[^>]+content="([^"]+)"/gi;
    let match;
    while ((match = metaRegex.exec(html)) !== null) {
        try {
            const src = new URL(match[1], baseUrl.origin).href;
            if (!seen.has(src)) { seen.add(src); images.push(src); }
        } catch { /* skip */ }
    }

    // <img src="..."> tags
    const imgRegex = /<img[^>]+src="([^"]+)"/gi;
    while ((match = imgRegex.exec(html)) !== null) {
        try {
            const src = new URL(match[1], baseUrl.origin).href;
            if (!seen.has(src) && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(src)) {
                seen.add(src);
                images.push(src);
            }
        } catch { /* skip */ }
    }

    return images.slice(0, 6);
}

async function fetchWebsiteContent(url: string): Promise<{ text: string; images: string[] }> {
    try {
        const baseUrl = new URL(url);

        // Fetch main page (including raw HTML for link/image extraction)
        const mainResponse = await fetch(url, {
            headers: FETCH_HEADERS,
            signal: AbortSignal.timeout(10000),
        });
        const mainHtml = await mainResponse.text();
        const mainText = mainHtml
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 3000);

        const images = extractImages(mainHtml, baseUrl);

        // Extract up to 2 internal subpages
        const internalLinks = extractInternalLinks(mainHtml, baseUrl).slice(0, 2);
        const subpageTexts = await Promise.all(internalLinks.map(fetchSinglePage));

        const parts = [`[Seite 1: ${url}]\n${mainText}`];
        internalLinks.forEach((link, i) => {
            if (subpageTexts[i]) parts.push(`[Seite ${i + 2}: ${link}]\n${subpageTexts[i]}`);
        });

        return { text: parts.join('\n\n---\n\n'), images };
    } catch {
        return { text: '', images: [] };
    }
}

export async function generateUXData(
    title: string,
    description: string,
    websiteUrl?: string,
    url2?: string,
    url3?: string
) {
    const { userId } = await auth();
    const allowedId = process.env.ALLOWED_USER_ID;
    if (allowedId && allowedId !== 'user_2xxxxxxxxxxxxxxxxxxxxxxx' && userId !== allowedId) {
        throw new Error('Unauthorized');
    }

    const settings = await getAISettings();
    if (!settings || !settings.apiKey) {
        throw new Error('AI Settings not configured. Please go to Admin -> Settings.');
    }

    let model;
    if (settings.provider === 'google') {
        const google = createGoogleGenerativeAI({ apiKey: settings.apiKey });
        model = google(settings.model);
    } else if (settings.provider === 'anthropic') {
        const anthropic = createAnthropic({ apiKey: settings.apiKey });
        model = anthropic(settings.model);
    } else if (settings.provider === 'mistral') {
        const mistral = createMistral({ apiKey: settings.apiKey });
        model = mistral(settings.model);
    } else {
        throw new Error('Invalid AI Provider');
    }

    const urls = [websiteUrl, url2, url3].filter(Boolean) as string[];
    let websiteContent = '';
    let websiteImages: string[] = [];

    if (urls.length > 0) {
        const allData = await Promise.all(urls.map(fetchWebsiteContent));
        const contentParts = allData
            .map((d, i) => d.text ? `[Quelle ${i + 1}: ${urls[i]}]\n${d.text}` : '')
            .filter(Boolean);
        websiteContent = contentParts.join('\n\n---\n\n');
        websiteImages = [...new Set(allData.flatMap(d => d.images))].slice(0, 8);
    }

    const prompt = `
    Handle als UX Forscher und Webentwickler. Analysiere die folgenden Informationen und generiere vollständige Projektdaten:
    ${title ? `Titel: ${title}` : ''}
    ${description ? `Beschreibung: ${description}` : ''}
    ${websiteContent ? `\nEchter Webseiteninhalt:\n${websiteContent}\n\nNutze den Webseiteninhalt als primäre Quelle für realistische und genaue Daten.` : ''}
    ${websiteImages.length > 0 ? `\nGefundene Bilder auf der Website:\n${websiteImages.join('\n')}\n\nVerwende eines dieser Bilder als projectImageUrl, falls es als Vorschaubild geeignet ist. Weitere passende Bilder können als galleryImages verwendet werden.` : ''}

    Gib das Ergebnis EXAKT als JSON-Objekt zurück mit folgendem Schema:
    {
      "title": "Projekttitel (von der Website extrahiert oder aus den Infos)",
      "description": "Projektbeschreibung in 3-5 Sätzen",
      "category": "Webdesign",
      "techStack": "Tech1, Tech2, Tech3",
      "projectImageUrl": "URL eines Vorschaubildes (aus der Website oder leer lassen)",
      "galleryImages": ["URL1", "URL2", "URL3"],
      "personaName": "Name der Persona",
      "personaBio": "Bio der Persona (ca. 150 Zeichen)",
      "personaImage": "URL zu einem passenden Profilbild von Unsplash",
      "painPoints": ["Point 1", "Point 2", "Point 3"],
      "empathySays": "Was sagt die Persona typischerweise?",
      "empathyThinks": "Was denkt die Persona?",
      "empathyFeels": "Wie fühlt sich die Persona?",
      "empathyDoes": "Was tut die Persona?",
      "userJourneyData": [
        {"label": "Phase 1", "value": 30},
        {"label": "Phase 2", "value": 60},
        {"label": "Phase 3", "value": 45},
        {"label": "Phase 4", "value": 85}
      ]
    }
    Für category wähle NUR einen dieser Werte: "Webdesign", "Webentwickler", "Fotograf".
    Für galleryImages: Verwende nur Bilder die tatsächlich auf der Website gefunden wurden. Falls keine vorhanden, gib ein leeres Array zurück.
    Keine Einleitung, kein Markdown, NUR das JSON-Objekt.
  `;

    const { text } = await generateText({
        model,
        prompt,
    });

    try {
        // Basic cleanup in case of markdown blocks
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error('AI Response Parsing Error:', text);
        throw new Error('Fehler beim Parsen der KI-Antwort.');
    }
}
