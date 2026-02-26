import { getProjects, deleteProject } from '@/app/actions/projects'
import Link from 'next/link'
import { Trash2, Plus, ExternalLink, Pencil, Settings, Star } from 'lucide-react'

export default async function AdminDashboard() {
    const projects = await getProjects().catch(() => [])

    return (
        <div className="min-h-screen bg-background text-foreground p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-border-custom pb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Portfolio Admin</h1>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-2 text-muted-custom hover:text-foreground px-3 py-2 rounded-md transition-colors text-sm"
                        >
                            <Settings size={16} />
                            KI Einstellungen
                        </Link>
                        <Link
                            href="/admin/testimonials"
                            className="flex items-center gap-2 text-muted-custom hover:text-foreground px-3 py-2 rounded-md transition-colors text-sm border border-border-custom"
                        >
                            <Star size={16} />
                            Testimonials
                        </Link>
                        <Link
                            href="/admin/new"
                            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity shadow-sm"
                        >
                            <Plus size={20} />
                            Neues Projekt
                        </Link>
                    </div>
                </header>

                <div className="bg-surface rounded-xl border border-border-custom overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-custom bg-surface-hover">
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-muted-custom">Titel</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-muted-custom">Kategorie</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-muted-custom">Tech-Stack</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-muted-custom text-right">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-custom px-6">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-surface-hover/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{project.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-surface-hover text-muted-custom px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                                            {project.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-custom text-sm">{project.techStack}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-3 justify-end items-center">
                                            <Link href={`/admin/edit/${project.id}`} className="text-muted-custom hover:text-foreground transition-colors">
                                                <Pencil size={18} />
                                            </Link>
                                            <form action={async () => {
                                                'use server'
                                                await deleteProject(project.id)
                                            }}>
                                                <button className="text-muted-custom hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                            <a href={project.imageUrl} target="_blank" rel="noopener noreferrer" className="text-muted-custom hover:text-foreground transition-colors">
                                                <ExternalLink size={18} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-custom italic">
                                        Keine Projekte vorhanden.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
