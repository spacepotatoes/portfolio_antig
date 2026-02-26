'use server'

import { Resend } from 'resend'

export async function sendContactMessage(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not configured')
        return { success: false, error: 'E-Mail-Dienst nicht konfiguriert.' }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
        from: 'Portfolio <onboarding@resend.dev>',
        to: 'hello@giuseppe-troiano.de',
        replyTo: email,
        subject: `[Portfolio] ${subject}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #111;">Neue Kontaktanfrage</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #666; width: 100px;">Name</td>
                        <td style="padding: 8px 0; font-weight: bold;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666;">E-Mail</td>
                        <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666;">Betreff</td>
                        <td style="padding: 8px 0;">${subject}</td>
                    </tr>
                </table>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
                <h3 style="color: #111;">Nachricht</h3>
                <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
        `,
    })

    if (error) {
        console.error('Resend error:', error)
        return { success: false, error: 'Fehler beim Senden. Bitte versuche es erneut.' }
    }

    return { success: true }
}
