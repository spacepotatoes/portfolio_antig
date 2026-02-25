'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project } from '@prisma/client'
import { X, ExternalLink, Maximize2 } from 'lucide-react'
import Link from 'next/link'

interface ProjectGridProps {
    initialProjects: Project[]
    activeCategory: string
}

export default function ProjectGrid({ initialProjects, activeCategory }: ProjectGridProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const filteredProjects = activeCategory === 'all'
        ? initialProjects
        : initialProjects.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase())

    const isPhotography = activeCategory.toLowerCase() === 'fotograf'

    return (
        <>
            <div className={`${isPhotography ? "masonry-grid" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"} stagger-container`}>
                <AnimatePresence mode='popLayout'>
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4 }}
                            className={`group relative stagger-item ${isPhotography ? "masonry-item" : "bg-surface rounded-xl border border-border-custom overflow-hidden hover:border-foreground transition-colors"}`}
                        >
                            <div className={`relative overflow-hidden ${isPhotography ? "h-full cursor-zoom-in" : "aspect-video cursor-pointer"}`}>
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    {isPhotography ? (
                                        <button onClick={() => setSelectedImage(project.imageUrl)}>
                                            <Maximize2 className="text-white" size={32} />
                                        </button>
                                    ) : (
                                        <Link href={`/projects/${project.id}`} className="text-center p-6 w-full h-full flex flex-col items-center justify-center text-white">
                                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                            <p className="text-sm text-zinc-300 line-clamp-2 mb-4">{project.description}</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {project.techStack.split(',').map(tech => (
                                                    <span key={tech} className="px-2 py-0.5 bg-white/10 text-[10px] uppercase tracking-widest font-bold rounded">
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {!isPhotography && (
                                <div className="p-6 border-t border-border-custom">
                                    <div className="flex justify-between items-start">
                                        <Link href={`/projects/${project.id}`}>
                                            <span className="text-[10px] text-muted-custom uppercase tracking-[0.2em] font-bold mb-1 block">
                                                {project.category}
                                            </span>
                                            <h3 className="text-lg font-bold group-hover:text-muted-custom transition-colors">{project.title}</h3>
                                        </Link>
                                        <Link href={`/projects/${project.id}`} className="text-muted-custom hover:text-foreground transition-colors">
                                            <ExternalLink size={20} />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={40} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={selectedImage}
                            className="max-w-full max-h-full object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
