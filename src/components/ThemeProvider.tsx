'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect, useState } from 'react'

type ColorVariant = 'slate' | 'amber' | 'green'

interface ColorVariantContextType {
    colorVariant: ColorVariant
    setColorVariant: (variant: ColorVariant) => void
}

const ColorVariantContext = React.createContext<ColorVariantContextType | undefined>(undefined)

export function useColorVariant() {
    const context = React.useContext(ColorVariantContext)
    if (!context) {
        throw new Error('useColorVariant must be used within a ColorVariantProvider')
    }
    return context
}

function ColorVariantProvider({ children }: { children: React.ReactNode }) {
    const [colorVariant, setColorVariantState] = useState<ColorVariant>('slate')

    useEffect(() => {
        // Load from localStorage or use default
        const stored = localStorage.getItem('color-variant') as ColorVariant | null
        const variant = (stored && ['slate', 'amber', 'green'].includes(stored)) ? stored : 'slate'

        setColorVariantState(variant)
        document.documentElement.setAttribute('data-color-variant', variant)
    }, [])

    const setColorVariant = (variant: ColorVariant) => {
        setColorVariantState(variant)
        localStorage.setItem('color-variant', variant)
        document.documentElement.setAttribute('data-color-variant', variant)
    }

    return (
        <ColorVariantContext.Provider value={{ colorVariant, setColorVariant }}>
            {children}
        </ColorVariantContext.Provider>
    )
}

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider {...props}>
            <ColorVariantProvider>{children}</ColorVariantProvider>
        </NextThemesProvider>
    )
}
