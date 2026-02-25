'use server'

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createMistral } from '@ai-sdk/mistral';
import { getAISettings } from '@/lib/ai-settings';
import { auth } from '@clerk/nextjs/server';

export async function generateUXData(title: string, description: string) {
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

    const prompt = `
    Handle als UX Forscher. Generiere detaillierte UX-Informationen für folgendes Projekt:
    Titel: ${title}
    Beschreibung: ${description}

    Gib das Ergebnis EXAKT als JSON-Objekt zurück mit folgendem Schema:
    {
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
