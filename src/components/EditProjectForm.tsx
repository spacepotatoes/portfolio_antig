'use client'

import { updateProject } from '@/app/actions/projects'
import { generateUXData } from '@/app/actions/ai'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Upload, Loader2, Sparkles, User, Brain, Layers } from 'lucide-react'
import { useState } from 'react'

interface Project {
    id: number
    title: string
    description: string
    category: string
    techStack: string
    imageUrl: string
    personaName: string | null
    personaImage: string | null
    personaBio: string | null
    painPoints: string | null
    userJourneyData: string | null
    empathySays: string | null
    empathyThinks: string | null
    empathyFeels: string | null
    empathyDoes: string | null
}

export default function EditProjectForm({ project }: { project: Project }) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    // Form States
    const [title, setTitle] = useState(project.title)
    const [description, setDescription] = useState(project.description)
    const [category, setCategory] = useState(project.category)
    const [techStack, setTechStack] = useState(project.techStack)
    const [projectImageUrl, setProjectImageUrl] = useState(project.imageUrl)
    const [personaName, setPersonaName] = useState(project.personaName || '')
    const [personaBio, setPersonaBio] = useState(project.personaBio || '')
    const [personaImage, setPersonaImage] = useState(project.personaImage || '')
    const [painPoints, setPainPoints] = useState(project.painPoints || '')
    const [userJourneyData, setUserJourneyData] = useState(project.userJourneyData || '')

    // Empathy Map States
    const [empathySays, setEmpathySays] = useState(project.empathySays || '')
    const [empathyThinks, setEmpathyThinks] = useState(project.empathyThinks || '')
    const [empathyFeels, setEmpathyFeels] = useState(project.empathyFeels || '')
    const [empathyDoes, setEmpathyDoes] = useState(project.empathyDoes || '')

    async function handleAIGenerate() {
        if (!title || !description) {
            alert('Bitte gib zuerst einen Titel und eine Beschreibung ein.')
            return
        }

        setIsGenerating(true)
        try {
            const data = await generateUXData(title, description)
            setPersonaName(data.personaName || '')
            setPersonaBio(data.personaBio || '')
            setPersonaImage(data.personaImage || '')
            setPainPoints(Array.isArray(data.painPoints) ? data.painPoints.join(', ') : data.painPoints || '')
            setEmpathySays(data.empathySays || '')
            setEmpathyThinks(data.empathyThinks || '')
            setEmpathyFeels(data.empathyFeels || '')
            setEmpathyDoes(data.empathyDoes || '')
            setUserJourneyData(JSON.stringify(data.userJourneyData))
        } catch (error: any) {
            alert(error.message || 'KI Generierung fehlgeschlagen.')
        } finally {
            setIsGenerating(false)
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        try {
            await updateProject(project.id, formData)
            router.push('/admin')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Fehler beim Aktualisieren des Projekts')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <Link href="/admin" className="flex items-center gap-2 text-muted-custom hover:text-foreground mb-6 transition-colors">
                        <ChevronLeft size={20} />
                        Zurück zum Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Projekt bearbeiten</h1>
                </header>

                <form action={handleSubmit} className="space-y-12">
                    {/* Basis Info */}
                    <section className="space-y-6 bg-surface p-8 rounded-3xl border border-border-custom shadow-sm">
                        <h2 className="text-xl font-bold flex items-center gap-2 pb-4 border-b border-border-custom">
                            <Layers size={18} /> Basis Informationen
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-muted-custom">Titel</label>
                                <input
                                    required
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-custom">Beschreibung</label>
                                <textarea
                                    required
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-muted-custom">Kategorie</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors appearance-none"
                                    >
                                        <option value="Webdesign">Webdesign</option>
                                        <option value="Webentwickler">Webentwickler</option>
                                        <option value="Fotograf">Fotograf</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="techStack" className="text-xs font-black uppercase tracking-widest text-muted-custom">Tech-Stack</label>
                                    <input
                                        required
                                        id="techStack"
                                        name="techStack"
                                        type="text"
                                        value={techStack}
                                        onChange={(e) => setTechStack(e.target.value)}
                                        className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="button"
                                    onClick={handleAIGenerate}
                                    disabled={isGenerating}
                                    className="w-full bg-surface-hover text-foreground py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center gap-3 border border-border-custom"
                                >
                                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles className="text-yellow-500" size={20} />}
                                    {isGenerating ? 'Generiere UX Case Study...' : 'UX Details mit KI aktualisieren'}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Persona & Empathy */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <section className="space-y-6 bg-surface p-8 rounded-3xl border border-border-custom shadow-sm">
                            <h2 className="text-xl font-bold flex items-center gap-2 pb-4 border-b border-border-custom">
                                <User size={18} /> Persona Details
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="personaName" className="text-xs font-black uppercase tracking-widest text-muted-custom">Name</label>
                                    <input id="personaName" name="personaName" type="text" value={personaName} onChange={e => setPersonaName(e.target.value)} className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 outline-none focus:border-foreground transition-colors" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative group flex flex-col items-center justify-center border border-dashed border-border-custom rounded-xl p-4 hover:border-foreground transition-colors cursor-pointer bg-background/50">
                                        <Upload className="text-muted-custom group-hover:text-foreground transition-colors mb-1" size={16} />
                                        <span className="text-muted-custom group-hover:text-foreground transition-colors text-[10px] font-bold uppercase tracking-widest">Neues Persona Bild</span>
                                        <input
                                            id="personaFile"
                                            name="personaFile"
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="personaImage" className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Oder Bild URL</label>
                                        <input id="personaImage" name="personaImage" type="text" value={personaImage} onChange={e => setPersonaImage(e.target.value)} className="w-full bg-background border border-border-custom rounded-xl px-3 py-2 text-xs outline-none focus:border-foreground transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="personaBio" className="text-xs font-black uppercase tracking-widest text-muted-custom">Kurzbio</label>
                                    <textarea id="personaBio" name="personaBio" rows={3} value={personaBio} onChange={e => setPersonaBio(e.target.value)} className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 outline-none resize-none focus:border-foreground transition-colors" />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6 bg-surface p-8 rounded-3xl border border-border-custom shadow-sm">
                            <h2 className="text-xl font-bold flex items-center gap-2 pb-4 border-b border-border-custom">
                                <Brain size={18} /> Empathy Map
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-custom tracking-tighter">Says</label>
                                    <input name="empathySays" value={empathySays} onChange={e => setEmpathySays(e.target.value)} className="w-full bg-background border border-border-custom rounded-lg p-2 text-xs focus:border-foreground outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-custom tracking-tighter">Thinks</label>
                                    <input name="empathyThinks" value={empathyThinks} onChange={e => setEmpathyThinks(e.target.value)} className="w-full bg-background border border-border-custom rounded-lg p-2 text-xs focus:border-foreground outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-custom tracking-tighter">Feels</label>
                                    <input name="empathyFeels" value={empathyFeels} onChange={e => setEmpathyFeels(e.target.value)} className="w-full bg-background border border-border-custom rounded-lg p-2 text-xs focus:border-foreground outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-custom tracking-tighter">Does</label>
                                    <input name="empathyDoes" value={empathyDoes} onChange={e => setEmpathyDoes(e.target.value)} className="w-full bg-background border border-border-custom rounded-lg p-2 text-xs focus:border-foreground outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-custom">Pain Points</label>
                                <input name="painPoints" value={painPoints} onChange={e => setPainPoints(e.target.value)} className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 outline-none focus:border-foreground transition-colors" />
                            </div>
                            <input type="hidden" name="userJourneyData" value={userJourneyData} />
                        </section>
                    </div>

                    {/* Media */}
                    <section className="space-y-6 bg-surface p-8 rounded-3xl border border-border-custom shadow-sm">
                        <h2 className="text-xl font-bold flex items-center gap-2 pb-4 border-b border-border-custom">
                            <Upload size={18} /> Media & Assets
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-border-custom rounded-3xl p-12 hover:border-foreground transition-colors group bg-background/30">
                                <Upload className="text-muted-custom group-hover:text-foreground transition-colors mb-2" size={32} />
                                <span className="text-muted-custom group-hover:text-foreground transition-colors text-sm font-bold uppercase tracking-widest text-center">Neues Hauptbild hochladen <br /><span className="text-[10px] opacity-50">(optional)</span></span>
                                <input
                                    id="imageFile"
                                    name="imageFile"
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                            <div className="space-y-4">
                                <label htmlFor="imageUrl" className="text-xs font-black uppercase tracking-widest text-muted-custom">Oder Bild-URL</label>
                                <input
                                    id="imageUrl"
                                    name="imageUrl"
                                    type="url"
                                    value={projectImageUrl}
                                    onChange={(e) => setProjectImageUrl(e.target.value)}
                                    className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </section>

                    <button
                        disabled={isPending}
                        type="submit"
                        className="w-full bg-foreground text-background py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all hover:scale-[1.01] disabled:bg-muted-custom flex items-center justify-center gap-3 shadow-2xl"
                    >
                        {isPending ? <Loader2 className="animate-spin" size={24} /> : 'Änderungen speichern'}
                    </button>
                </form>
            </div>
        </div>
    )
}
