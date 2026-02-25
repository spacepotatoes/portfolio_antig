'use client'

import { useState, useEffect } from 'react'
import { updateAISettings, fetchAISettings } from '@/app/actions/ai-settings'
import { Save, Cpu, Key, Layers, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
    const [isPending, setIsPending] = useState(false)
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAISettings().then(s => {
            setSettings(s)
            setLoading(false)
        })
    }, [])

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        try {
            await updateAISettings(formData)
            alert('Einstellungen gespeichert!')
        } catch (error) {
            alert('Fehler beim Speichern.')
        } finally {
            setIsPending(false)
        }
    }

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>

    return (
        <div className="max-w-4xl mx-auto p-6 py-12 space-y-12 transition-colors duration-300">
            <header>
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">KI Einstellungen</h1>
                <p className="text-muted-custom">Konfiguriere deine bevorzugten KI-Modelle für die Inhaltsgenerierung.</p>
            </header>

            <form action={handleSubmit} className="bg-surface border border-border-custom rounded-3xl p-8 md:p-12 space-y-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-custom">
                            <Layers size={14} /> Provider
                        </label>
                        <select
                            name="provider"
                            defaultValue={settings?.provider || 'google'}
                            className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 outline-none focus:border-foreground transition-colors appearance-none"
                        >
                            <option value="google">Google Gemini</option>
                            <option value="anthropic">Anthropic Claude</option>
                            <option value="mistral">Mistral AI</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-custom">
                            <Cpu size={14} /> Modell Name
                        </label>
                        <input
                            name="model"
                            type="text"
                            defaultValue={settings?.model || 'gemini-1.5-flash'}
                            placeholder="e.g. gemini-1.5-pro, claude-3-5-sonnet-20240620"
                            className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 outline-none focus:border-foreground transition-colors"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-custom">
                        <Key size={14} /> API Key
                    </label>
                    <input
                        name="apiKey"
                        type="password"
                        defaultValue={settings?.apiKey || ''}
                        placeholder="Passe deinen API Key hier an..."
                        className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 outline-none focus:border-foreground transition-colors"
                    />
                </div>

                <button
                    disabled={isPending}
                    type="submit"
                    className="bg-foreground text-background px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:bg-muted-custom flex items-center gap-2 shadow-lg"
                >
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Einstellungen Speichern
                </button>
            </form>

            <div className="bg-surface border border-border-custom border-dashed rounded-3xl p-8 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                    <Key size={18} className="text-muted-custom" /> Woher bekomme ich Keys?
                </h3>
                <ul className="text-sm text-muted-custom space-y-2 list-disc pl-5">
                    <li><strong>Gemini:</strong> <a href="https://aistudio.google.com/" target="_blank" className="underline hover:text-foreground">Google AI Studio</a></li>
                    <li><strong>Claude:</strong> <a href="https://console.anthropic.com/" target="_blank" className="underline hover:text-foreground">Anthropic Console</a></li>
                    <li><strong>Mistral:</strong> <a href="https://console.mistral.ai/" target="_blank" className="underline hover:text-foreground">Mistral Console</a></li>
                </ul>
            </div>
        </div>
    )
}
