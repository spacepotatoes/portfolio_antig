'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function GsapAnimations() {
    const isInitialized = useRef(false)

    useEffect(() => {
        if (isInitialized.current) return
        isInitialized.current = true

        // Hero Animations
        gsap.from('.hero-title', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.2
        })

        gsap.from('.hero-subtitle', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.6
        })

        // Section Animations
        gsap.utils.toArray('.reveal-section').forEach((section: any) => {
            gsap.from(section, {
                opacity: 0,
                y: 60,
                duration: 0.8,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            })
        })

        // Staggered Cards removed to avoid conflict with Framer Motion filtering
    }, [])

    return null
}
