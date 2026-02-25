import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export interface AISettings {
    provider: 'google' | 'anthropic' | 'mistral';
    model: string;
    apiKey: string;
}

const SETTINGS_PATH = join(process.cwd(), 'ai-settings.json');

export async function getAISettings(): Promise<AISettings | null> {
    try {
        const content = await readFile(SETTINGS_PATH, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        return null;
    }
}

export async function saveAISettings(settings: AISettings) {
    await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}
