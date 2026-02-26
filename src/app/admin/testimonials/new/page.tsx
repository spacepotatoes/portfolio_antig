import { createTestimonial } from '@/app/actions/testimonials'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function NewTestimonial() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-2xl mx-auto">
                <header className="mb-10">
                    <Link href="/admin/testimonials" className="text-xs text-muted-custom hover:text-foreground uppercase tracking-widest mb-2 block">← Testimonials</Link>
                    <h1 className="text-3xl font-bold tracking-tight">Neues Testimonial</h1>
                </header>

                <form
                    action={async (formData: FormData) => {
                        'use server'
                        await createTestimonial({
                            name: formData.get('name') as string,
                            role: formData.get('role') as string,
                            company: (formData.get('company') as string) || undefined,
                            avatar: (formData.get('avatar') as string) || undefined,
                            rating: parseInt(formData.get('rating') as string) || 5,
                            text: formData.get('text') as string,
                        })
                        redirect('/admin/testimonials')
                    }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-custom mb-2">Name *</label>
                            <input name="name" required className="w-full bg-surface border border-border-custom rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-custom mb-2">Rolle *</label>
                            <input name="role" required placeholder="z.B. CEO, Marketing Leiterin" className="w-full bg-surface border border-border-custom rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-custom mb-2">Unternehmen</label>
                            <input name="company" className="w-full bg-surface border border-border-custom rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-custom mb-2">Bewertung (1–5)</label>
                            <select name="rating" defaultValue="5" className="w-full bg-surface border border-border-custom rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors">
                                {[5, 4, 3, 2, 1].map(n => (
                                    <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-custom mb-2">Avatar URL (optional)</label>
                        <input name="avatar" type="url" placeholder="https://..." className="w-full bg-surface border border-border-custom rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-custom mb-2">Bewertungstext *</label>
                        <textarea name="text" required rows={5} className="w-full bg-surface border border-border-custom rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors resize-none" />
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" className="bg-foreground text-background px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm">
                            Speichern
                        </button>
                        <Link href="/admin/testimonials" className="px-6 py-2.5 rounded-lg border border-border-custom text-sm hover:bg-surface transition-colors">
                            Abbrechen
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
