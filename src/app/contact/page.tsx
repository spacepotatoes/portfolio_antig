'use client'

import { useState } from 'react'
import { sendContactMessage } from '@/app/actions/contact'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactPage() {
    const [isPending, setIsPending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setErrorMsg(null)
        try {
            const result = await sendContactMessage(formData)
            if (result.success) {
                setIsSuccess(true)
            } else {
                setErrorMsg(result.error ?? 'Unbekannter Fehler.')
            }
        } catch {
            setErrorMsg('Fehler beim Senden der Nachricht.')
        } finally {
            setIsPending(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground transition-colors duration-300">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-surface border border-border-custom p-12 rounded-3xl text-center max-w-lg w-full space-y-6 shadow-xl"
                >
                    <div className="w-20 h-20 bg-foreground text-background rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-bold">Vielen Dank!</h1>
                    <p className="text-muted-custom">Deine Nachricht wurde erfolgreich gesendet. Ich werde mich so schnell wie möglich bei dir melden.</p>
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="px-8 py-3 bg-foreground text-background font-bold rounded-full hover:opacity-80 transition-opacity"
                    >
                        Zurück
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 bg-background text-foreground transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
            >
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">LET&apos;S <br /> <span className="text-muted-custom">WORK</span> <br /> TOGETHER</h1>
                <p className="text-xl text-muted-custom font-light max-w-md">
                    Hast du eine Projektidee oder möchtest du einfach nur Hallo sagen? Schreib mir eine Nachricht.
                </p>
                <div className="pt-8 space-y-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-custom/60">Kontaktinfo</p>
                    <p className="text-2xl font-bold">hello@giuseppe-troiano.de</p>
                    <p className="text-muted-custom">Berlin, Deutschland</p>
                </div>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                action={handleSubmit}
                className="bg-surface p-8 md:p-12 rounded-3xl border border-border-custom space-y-6 shadow-lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-custom">Name</label>
                        <input required id="name" name="name" type="text" className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors" placeholder="Max Mustermann" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-custom">E-Mail</label>
                        <input required id="email" name="email" type="email" className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors" placeholder="max@beispiel.de" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-custom">Betreff</label>
                    <input required id="subject" name="subject" type="text" className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors" placeholder="Projektanfrage" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-custom">Nachricht</label>
                    <textarea required id="message" name="message" rows={6} className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors resize-none" placeholder="Was hast du im Kopf?"></textarea>
                </div>
                {errorMsg && (
                    <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        {errorMsg}
                    </p>
                )}
                <button
                    disabled={isPending}
                    type="submit"
                    className="w-full bg-foreground text-background py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:bg-muted-custom flex items-center justify-center gap-3 shadow-xl"
                >
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    {isPending ? 'Senden...' : 'Nachricht Senden'}
                </button>
            </motion.form>
        </div>
    )
}
