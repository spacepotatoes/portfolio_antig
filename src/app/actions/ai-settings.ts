'use server'

import { getAISettings, saveAISettings, type AISettings } from '@/lib/ai-settings';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
    const { userId } = await auth();
    const allowedId = process.env.ALLOWED_USER_ID;
    if (!userId || (allowedId && allowedId !== 'user_2xxxxxxxxxxxxxxxxxxxxxxx' && userId !== allowedId)) {
        throw new Error('Unauthorized');
    }
}

export async function updateAISettings(formData: FormData) {
    await checkAdmin();

    const settings: AISettings = {
        provider: formData.get('provider') as any,
        model: formData.get('model') as string,
        apiKey: formData.get('apiKey') as string,
    };

    await saveAISettings(settings);
    revalidatePath('/admin/settings');
}

export async function fetchAISettings() {
    await checkAdmin();
    return await getAISettings();
}
