'use client'

import { updateProject } from '@/app/actions/projects'
import { generateUXData } from '@/app/actions/ai'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Upload, Loader2, Sparkles, User, Brain, Layers, Plus, Images, X, Trash2 } from 'lucide-react'
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
    galleryImages: string | null
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

    // Image Previews (initialized with existing images)
    const [imagePreview, setImagePreview] = useState<string | null>(project.imageUrl || null)
    const [personaPreview, setPersonaPreview] = useState<string | null>(project.personaImage || null)

    const [websiteUrl, setWebsiteUrl] = useState('')
    const [url2, setUrl2] = useState('')
    const [url3, setUrl3] = useState('')

    // Overwrite settings for AI generation
    const [overwrite, setOverwrite] = useState({
        title: false, description: false, techStack: false,
        projectImageUrl: false, persona: false, empathy: false,
        painPoints: false, userJourney: false, gallery: false,
    })

    // Gallery: existing URLs + new upload slots
    const [existingGallery, setExistingGallery] = useState<string[]>(
        project.galleryImages ? JSON.parse(project.galleryImages) : []
    )
    const [gallerySlots, setGallerySlots] = useState<{ preview: string | null, url: string }[]>([])

    async function handleAIGenerate() {
        const hasUrl = websiteUrl || url2 || url3
        if (!hasUrl && (!title || !description)) {
            alert('Bitte gib mindestens eine URL oder Titel + Beschreibung ein.')
            return
        }

        setIsGenerating(true)
        try {
            const data = await generateUXData(
                title,
                description,
                websiteUrl || undefined,
                url2 || undefined,
                url3 || undefined
            )
            if ((!title || overwrite.title) && data.title) setTitle(data.title)
            if ((!description || overwrite.description) && data.description) setDescription(data.description)
            if ((!techStack || overwrite.techStack) && data.techStack) setTechStack(data.techStack)
            if ((!projectImageUrl || overwrite.projectImageUrl) && data.projectImageUrl) setProjectImageUrl(data.projectImageUrl)
            if (!personaName || overwrite.persona) setPersonaName(data.personaName || '')
            if (!personaBio || overwrite.persona) setPersonaBio(data.personaBio || '')
            if (!personaImage || overwrite.persona) setPersonaImage(data.personaImage || '')
            if (!painPoints || overwrite.painPoints) setPainPoints(Array.isArray(data.painPoints) ? data.painPoints.join(', ') : data.painPoints || '')
            if (!empathySays || overwrite.empathy) setEmpathySays(data.empathySays || '')
            if (!empathyThinks || overwrite.empathy) setEmpathyThinks(data.empathyThinks || '')
            if (!empathyFeels || overwrite.empathy) setEmpathyFeels(data.empathyFeels || '')
            if (!empathyDoes || overwrite.empathy) setEmpathyDoes(data.empathyDoes || '')
            if ((!userJourneyData || overwrite.userJourney) && data.userJourneyData) setUserJourneyData(JSON.stringify(data.userJourneyData))
            if ((existingGallery.length === 0 && gallerySlots.length === 0 || overwrite.gallery) && Array.isArray(data.galleryImages) && data.galleryImages.length > 0) {
                setGallerySlots(data.galleryImages.slice(0, 5).map((url: string) => ({ preview: url, url })))
            }
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

                    {/* KI-Analyse */}
                    <section className="space-y-5 bg-surface p-8 rounded-3xl border border-border-custom shadow-sm">
                        <h2 className="text-xl font-bold flex items-center gap-2 pb-4 border-b border-border-custom">
                            <Sparkles size={18} className="text-yellow-500" /> KI-Analyse
                        </h2>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-custom">URLs — KI analysiert alle Quellen</label>
                            <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors text-sm" placeholder="URL 1 — z.B. Website" />
                            <input type="url" value={url2} onChange={(e) => setUrl2(e.target.value)} className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors text-sm" placeholder="URL 2 — z.B. GitHub, Behance, ..." />
                            <input type="url" value={url3} onChange={(e) => setUrl3(e.target.value)} className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 focus:border-foreground outline-none transition-colors text-sm" placeholder="URL 3 — z.B. Live-Demo, Figma, ..." />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-custom mb-2">Gefüllte Felder überschreiben erlauben</p>
                            <div className="flex flex-wrap gap-x-5 gap-y-2">
                                {([
                                    { key: 'title', label: 'Titel', hasValue: !!title },
                                    { key: 'description', label: 'Beschreibung', hasValue: !!description },
                                    { key: 'techStack', label: 'Tech-Stack', hasValue: !!techStack },
                                    { key: 'projectImageUrl', label: 'Hauptbild', hasValue: !!projectImageUrl },
                                    { key: 'persona', label: 'Persona', hasValue: !!(personaName || personaBio) },
                                    { key: 'empathy', label: 'Empathy Map', hasValue: !!(empathySays || empathyThinks) },
                                    { key: 'painPoints', label: 'Pain Points', hasValue: !!painPoints },
                                    { key: 'userJourney', label: 'User Journey', hasValue: !!userJourneyData },
                                    { key: 'gallery', label: 'Galerie', hasValue: existingGallery.length > 0 || gallerySlots.length > 0 },
                                ] as { key: keyof typeof overwrite, label: string, hasValue: boolean }[]).map(({ key, label, hasValue }) => (
                                    <label key={key} className={`flex items-center gap-1.5 text-xs select-none ${hasValue ? 'cursor-pointer text-foreground' : 'cursor-not-allowed opacity-25'}`}>
                                        <input type="checkbox" checked={overwrite[key]} onChange={(e) => setOverwrite(prev => ({ ...prev, [key]: e.target.checked }))} disabled={!hasValue} className="rounded accent-yellow-500" />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button type="button" onClick={handleAIGenerate} disabled={isGenerating} className="w-full bg-surface-hover text-foreground py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center gap-3 border border-border-custom">
                            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles className="text-yellow-500" size={20} />}
                            {isGenerating ? 'KI analysiert...' : 'Alle Felder mit KI befüllen'}
                        </button>
                    </section>

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
                                    <div className={`relative group flex flex-col items-center justify-center border border-dashed rounded-xl hover:border-foreground transition-colors cursor-pointer overflow-hidden bg-background/50 ${personaPreview ? 'border-accent' : 'border-border-custom p-4'}`}>
                                        {personaPreview ? (
                                            <img src={personaPreview} alt="Persona" className="w-full h-20 object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="text-muted-custom group-hover:text-foreground transition-colors mb-1" size={16} />
                                                <span className="text-muted-custom group-hover:text-foreground transition-colors text-[10px] font-bold uppercase tracking-widest">Neues Persona Bild</span>
                                            </>
                                        )}
                                        <input
                                            id="personaFile"
                                            name="personaFile"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) setPersonaPreview(URL.createObjectURL(file))
                                            }}
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
                            <div className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-3xl hover:border-foreground transition-colors cursor-pointer overflow-hidden bg-background/30 ${imagePreview ? 'border-accent' : 'border-border-custom p-12'}`}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Vorschau" className="w-full h-48 object-cover" />
                                ) : (
                                    <>
                                        <Upload className="text-muted-custom group-hover:text-foreground transition-colors mb-2" size={32} />
                                        <span className="text-muted-custom group-hover:text-foreground transition-colors text-sm font-bold uppercase tracking-widest text-center">Neues Hauptbild hochladen <br /><span className="text-[10px] opacity-50">(optional)</span></span>
                                    </>
                                )}
                                <input
                                    id="imageFile"
                                    name="imageFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) setImagePreview(URL.createObjectURL(file))
                                    }}
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

                    {/* Gallery */}
                    <section className="space-y-6 bg-surface p-8 rounded-3xl border border-border-custom shadow-sm">
                        <div className="flex justify-between items-center pb-4 border-b border-border-custom">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Images size={18} /> Bildergalerie
                            </h2>
                            {existingGallery.length + gallerySlots.length < 5 && (
                                <button
                                    type="button"
                                    onClick={() => setGallerySlots([...gallerySlots, { preview: null, url: '' }])}
                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent hover:opacity-80 transition-opacity"
                                >
                                    <Plus size={14} /> Bild hinzufügen
                                </button>
                            )}
                        </div>

                        {/* Hidden field to pass existing gallery to server action */}
                        <input type="hidden" name="existingGallery" value={JSON.stringify(existingGallery)} />

                        {existingGallery.length === 0 && gallerySlots.length === 0 ? (
                            <p className="text-sm text-muted-custom text-center py-4">Noch keine Galeriebilder. Klicke auf "Bild hinzufügen".</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Existing gallery images */}
                                {existingGallery.map((url, i) => (
                                    <div key={`existing-${i}`} className="space-y-2">
                                        <div className="relative rounded-2xl overflow-hidden border-2 border-accent">
                                            <img src={url} alt={`Galerie ${i + 1}`} className="w-full aspect-video object-cover" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setExistingGallery(existingGallery.filter((_, idx) => idx !== i))}
                                            className="w-full flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={12} /> Entfernen
                                        </button>
                                    </div>
                                ))}
                                {/* New upload slots */}
                                {gallerySlots.map((slot, i) => (
                                    <div key={`new-${i}`} className="space-y-2">
                                        <div className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl hover:border-foreground transition-colors cursor-pointer overflow-hidden bg-background/30 ${slot.preview ? 'border-accent' : 'border-border-custom aspect-video'}`}>
                                            {slot.preview ? (
                                                <img src={slot.preview} alt={`Neu ${i + 1}`} className="w-full aspect-video object-cover" />
                                            ) : (
                                                <>
                                                    <Upload className="text-muted-custom group-hover:text-foreground mb-1" size={20} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">Neu</span>
                                                </>
                                            )}
                                            <input
                                                name={`galleryFile_${i}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        const updated = [...gallerySlots]
                                                        updated[i] = { ...updated[i], preview: URL.createObjectURL(file) }
                                                        setGallerySlots(updated)
                                                    }
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                name={`galleryUrl_${i}`}
                                                type="url"
                                                value={slot.url}
                                                onChange={(e) => {
                                                    const updated = [...gallerySlots]
                                                    updated[i] = { ...updated[i], url: e.target.value }
                                                    setGallerySlots(updated)
                                                }}
                                                placeholder="Oder URL"
                                                className="flex-1 bg-background border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-foreground transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setGallerySlots(gallerySlots.filter((_, idx) => idx !== i))}
                                                className="text-muted-custom hover:text-red-500 transition-colors shrink-0"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
