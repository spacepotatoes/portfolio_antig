'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryLightboxProps {
    images: string[]
    projectTitle: string
}

export default function GalleryLightbox({ images, projectTitle }: GalleryLightboxProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const close = () => setActiveIndex(null)

    const prev = useCallback(() => {
        setActiveIndex(i => i !== null ? (i - 1 + images.length) % images.length : null)
    }, [images.length])

    const next = useCallback(() => {
        setActiveIndex(i => i !== null ? (i + 1) % images.length : null)
    }, [images.length])

    useEffect(() => {
        if (activeIndex === null) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close()
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [activeIndex, prev, next])

    useEffect(() => {
        document.body.style.overflow = activeIndex !== null ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [activeIndex])

    return (
        <>
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((url, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className="rounded-2xl overflow-hidden border border-border-custom group cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-accent"
                        aria-label={`${projectTitle} – Bildergalerie, Bild ${i + 1} von ${images.length} vergrößern`}
                    >
                        <img
                            src={url}
                            alt={`${projectTitle} – Bildergalerie, Bild ${i + 1} von ${images.length}`}
                            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {activeIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-200"
                    onClick={close}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${projectTitle} – Bildergalerie`}
                >
                    {/* Close */}
                    <button
                        onClick={close}
                        className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                        aria-label="Schließen (Escape)"
                    >
                        <X size={28} />
                    </button>

                    {/* Prev */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); prev() }}
                            className="absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
                            aria-label="Vorheriges Bild (←)"
                        >
                            <ChevronLeft size={36} />
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="flex items-center justify-center px-16"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[activeIndex]}
                            alt={`${projectTitle} – Bildergalerie, Bild ${activeIndex + 1} von ${images.length}`}
                            className="max-w-[85vw] max-h-[78vh] object-contain rounded-xl shadow-2xl"
                        />
                    </div>

                    {/* Caption */}
                    <div className="mt-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <p className="text-white/90 font-semibold text-sm tracking-wide">{projectTitle}</p>
                        <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">
                            Bild {activeIndex + 1} von {images.length}
                        </p>
                    </div>

                    {/* Next */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); next() }}
                            className="absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
                            aria-label="Nächstes Bild (→)"
                        >
                            <ChevronRight size={36} />
                        </button>
                    )}

                    {/* Dot indicators */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 flex gap-2" onClick={(e) => e.stopPropagation()}>
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`rounded-full transition-all duration-200 ${i === activeIndex ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
                                    aria-label={`Bild ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
