'use server'

import { revalidatePath } from 'next/cache'

export async function sendContactMessage(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    // Simuliere Verzögerung
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('--- NEUE KONTAKTANFRAGE ---')
    console.log(`Von: ${name} <${email}>`)
    console.log(`Betreff: ${subject}`)
    console.log(`Nachricht: ${message}`)
    console.log('---------------------------')

    // Hier könnte man Resend oder eine andere Mail-API anbinden
    // Für jetzt ist es ein simulierter Erfolg

    return { success: true }
}
