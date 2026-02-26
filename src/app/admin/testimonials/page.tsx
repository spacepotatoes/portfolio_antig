import { getTestimonials, deleteTestimonial } from '@/app/actions/testimonials'
import Link from 'next/link'
import { Trash2, Plus, Pencil, Star } from 'lucide-react'

export default async function AdminTestimonials() {
    const testimonials = await getTestimonials()

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-border-custom pb-6">
                    <div>
                        <Link href="/admin" className="text-xs text-muted-custom hover:text-foreground uppercase tracking-widest mb-2 block">← Admin</Link>
                        <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
                    </div>
                    <Link
                        href="/admin/testimonials/new"
                        className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
                    >
                        <Plus size={18} />
                        Neues Testimonial
                    </Link>
                </header>

                <div className="bg-surface rounded-xl border border-border-custom overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-custom bg-surface-hover">
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-muted-custom">Person</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-muted-custom">Bewertung</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-muted-custom">Text</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-muted-custom text-right">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-custom">
                            {testimonials.map((t) => (
                                <tr key={t.id} className="hover:bg-surface-hover/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{t.name}</div>
                                        <div className="text-xs text-muted-custom">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: t.rating }).map((_, i) => (
                                                <Star key={i} size={12} className="text-accent fill-accent" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-custom text-sm max-w-xs">
                                        <span className="line-clamp-2">{t.text}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-3 justify-end items-center">
                                            <Link href={`/admin/testimonials/edit/${t.id}`} className="text-muted-custom hover:text-foreground transition-colors">
                                                <Pencil size={18} />
                                            </Link>
                                            <form action={async () => {
                                                'use server'
                                                await deleteTestimonial(t.id)
                                            }}>
                                                <button className="text-muted-custom hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {testimonials.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-custom italic">
                                        Keine Testimonials vorhanden.
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
