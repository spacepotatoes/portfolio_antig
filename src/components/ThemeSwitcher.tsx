'use client'

import { useTheme } from 'next-themes'
import { useColorVariant } from './ThemeProvider'
import { useEffect, useState } from 'react'
import { Sun, Moon, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ColorVariant = 'slate' | 'amber' | 'green'

const colorVariants = [
    { id: 'slate', name: 'Cool Slate', light: '#0066cc', dark: '#3b82f6' },
    { id: 'amber', name: 'Warm Amber', light: '#d97706', dark: '#fbbf24' },
    { id: 'green', name: 'Sage Green', light: '#059669', dark: '#10b981' },
]

export default function ThemeSwitcher() {
    const { resolvedTheme, setTheme } = useTheme()
    const { colorVariant, setColorVariant } = useColorVariant()
    const [mounted, setMounted] = useState(false)
    const [showColorMenu, setShowColorMenu] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="w-20 h-10" />

    const isDark = resolvedTheme === 'dark'
    const currentColor = colorVariants.find(c => c.id === colorVariant) || colorVariants[0]
    const displayColor = isDark ? currentColor.dark : currentColor.light

    return (
        <div className="flex items-center gap-2">
            {/* Theme Toggle Button (Dark/Light) */}
            <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="relative w-10 h-10 flex items-center justify-center rounded-full border border-border-custom hover:bg-surface-hover transition-colors overflow-hidden"
                aria-label="Toggle Theme"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isDark ? 'dark' : 'light'}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </motion.div>
                </AnimatePresence>
            </button>

            {/* Color Variant Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowColorMenu(!showColorMenu)}
                    className="relative w-10 h-10 flex items-center justify-center rounded-full border border-border-custom hover:bg-surface-hover transition-colors overflow-hidden"
                    aria-label="Toggle Color Variant"
                    title={currentColor.name}
                >
                    <motion.div
                        key={colorVariant}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Palette size={18} style={{ color: displayColor }} />
                    </motion.div>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {showColorMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 bg-surface border border-border-custom rounded-lg shadow-lg z-50"
                        >
                            {colorVariants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => {
                                        setColorVariant(variant.id as ColorVariant)
                                        setShowColorMenu(false)
                                    }}
                                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-hover transition-colors text-left text-sm ${
                                        colorVariant === variant.id ? 'bg-surface-hover' : ''
                                    }`}
                                >
                                    <div
                                        className="w-4 h-4 rounded-full border-2 border-current"
                                        style={{
                                            backgroundColor: isDark ? variant.dark : variant.light,
                                            borderColor: 'currentColor',
                                        }}
                                    />
                                    <span className="text-foreground">{variant.name}</span>
                                    {colorVariant === variant.id && (
                                        <span className="ml-auto text-accent font-bold">✓</span>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
