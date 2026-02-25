import { getProjectById } from '@/app/actions/projects'
import { notFound } from 'next/navigation'
import UserJourneyChart from '@/components/UserJourneyChart'
import EmpathyMap from '@/components/EmpathyMap'
import { ArrowLeft, AlertCircle, Layers, MapPin } from 'lucide-react'
import Link from 'next/link'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const project = await getProjectById(parseInt(id)) as any

    if (!project) notFound()

    const techItems: string[] = project.techStack?.split(',').map((t: string) => t.trim()).filter(Boolean) ?? []
    const painItems: string[] = (project.painPoints as string)?.split(',').map((p: string) => p.trim()).filter(Boolean) ?? []

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* ── Hero ── */}
            <section className="relative h-[65vh] overflow-hidden">
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="max-w-7xl mx-auto w-full px-6 pb-14">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-muted-custom hover:text-foreground mb-8 transition-colors uppercase tracking-widest text-xs font-bold"
                        >
                            <ArrowLeft size={14} />
                            Zurück zur Übersicht
                        </Link>

                        <span className="text-sm text-muted-custom font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent" />
                            {project.category}
                        </span>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none">
                            {project.title}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {techItems.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 bg-foreground/10 border border-border-custom text-xs font-bold uppercase tracking-widest rounded-full"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Main Content ── */}
            <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Left column */}
                <div className="lg:col-span-8 space-y-20">

                    {/* Beschreibung */}
                    <div>
                        <span className="text-sm text-muted-custom font-bold tracking-widest uppercase mb-3 block">
                            Das Projekt
                        </span>
                        <p className="text-xl text-muted-custom leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    {/* Empathy Map */}
                    {(project.empathySays || project.empathyThinks || project.empathyFeels || project.empathyDoes) && (
                        <div className="border-t border-border-custom pt-16 space-y-8">
                            <div>
                                <span className="text-sm text-muted-custom font-bold tracking-widest uppercase mb-3 block">
                                    Nutzerperspektive
                                </span>
                                <h2 className="text-3xl font-bold">Empathy Map</h2>
                                <p className="text-muted-custom mt-2">
                                    Ein tieferer Einblick in die Gedankenwelt des Nutzers
                                </p>
                            </div>
                            <EmpathyMap
                                says={project.empathySays}
                                thinks={project.empathyThinks}
                                feels={project.empathyFeels}
                                does={project.empathyDoes}
                            />
                        </div>
                    )}

                    {/* User Journey */}
                    {project.userJourneyData && (
                        <div className="border-t border-border-custom pt-16 space-y-8">
                            <div>
                                <span className="text-sm text-muted-custom font-bold tracking-widest uppercase mb-3 block">
                                    UX-Analyse
                                </span>
                                <h2 className="text-3xl font-bold">User Journey</h2>
                                <p className="text-muted-custom mt-2">
                                    Visualisierung der Nutzererfahrung über verschiedene Berührungspunkte
                                </p>
                            </div>
                            <div className="bg-surface border border-border-custom rounded-2xl p-8">
                                <UserJourneyChart data={project.userJourneyData} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Persona Card */}
                    <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
                        <div className="relative h-52 overflow-hidden">
                            <img
                                src={project.personaImage || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80'}
                                alt={project.personaName || 'Persona'}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                            <div className="absolute bottom-4 left-5">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-custom">
                                    Target Persona
                                </span>
                                <h3 className="text-xl font-bold">{project.personaName || 'Anonymer Nutzer'}</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-muted-custom text-sm leading-relaxed">
                                {project.personaBio || 'Diese Persona steht stellvertretend für die Kernzielgruppe dieses Projekts.'}
                            </p>
                        </div>
                    </div>

                    {/* Pain Points */}
                    {painItems.length > 0 && (
                        <div className="bg-surface border border-border-custom rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 bg-foreground text-background flex items-center justify-center rounded-xl shrink-0">
                                    <AlertCircle size={18} />
                                </div>
                                <h3 className="font-bold uppercase tracking-wide text-sm">Pain Points</h3>
                            </div>
                            <ul className="space-y-3">
                                {painItems.map((point, i) => (
                                    <li key={i} className="flex gap-3 text-muted-custom text-sm leading-relaxed">
                                        <span className="text-accent font-bold mt-0.5 shrink-0">•</span>
                                        <p>{point}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Expertise / Category */}
                    <div className="rounded-2xl p-6 bg-accent/10 border border-accent/30 space-y-2">
                        <div className="flex items-center gap-2 text-muted-custom text-xs font-bold uppercase tracking-widest mb-3">
                            <Layers size={16} className="text-accent" />
                            Expertise
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{project.category}</p>
                        <p className="text-sm text-muted-custom">
                            {techItems.length} {techItems.length === 1 ? 'Technologie' : 'Technologien'} im Einsatz
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
