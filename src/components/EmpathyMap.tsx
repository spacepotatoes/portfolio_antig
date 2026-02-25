'use client'

import { motion } from 'framer-motion'

interface EmpathyMapProps {
    says: string | null
    thinks: string | null
    feels: string | null
    does: string | null
}

export default function EmpathyMap({ says, thinks, feels, does }: EmpathyMapProps) {
    if (!says && !thinks && !feels && !does) return null

    const items = [
        { label: 'Sagt', content: says, color: 'border-blue-500/30' },
        { label: 'Denkt', content: thinks, color: 'border-purple-500/30' },
        { label: 'Fühlt', content: feels, color: 'border-pink-500/30' },
        { label: 'Tut', content: does, color: 'border-green-500/30' }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {items.map((item, i) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-surface p-6 rounded-2xl border ${item.color} flex flex-col gap-2`}
                >
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-custom">{item.label}</span>
                    <p className="text-sm text-foreground italic">"{item.content || '...'}"</p>
                </motion.div>
            ))}
        </div>
    )
}
