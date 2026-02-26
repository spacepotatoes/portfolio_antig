import { prisma } from '@/lib/prisma';

export interface AISettings {
    provider: 'google' | 'anthropic' | 'mistral';
    model: string;
    apiKey: string;
}

export async function getAISettings(): Promise<AISettings | null> {
    try {
        const row = await prisma.setting.findUnique({ where: { key: 'ai-settings' } });
        if (!row) return null;
        return JSON.parse(row.value) as AISettings;
    } catch {
        return null;
    }
}

export async function saveAISettings(settings: AISettings) {
    await prisma.setting.upsert({
        where: { key: 'ai-settings' },
        update: { value: JSON.stringify(settings) },
        create: { key: 'ai-settings', value: JSON.stringify(settings) },
    });
}
