'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ButtonProps {
    href?: string
    onClick?: () => void
    variant?: 'primary' | 'secondary'
    children: React.ReactNode
    showArrow?: boolean
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
    className?: string
    type?: 'button' | 'submit'
}

export default function Button({
    href,
    onClick,
    variant = 'primary',
    children,
    showArrow = false,
    iconLeft,
    iconRight,
    className = '',
    type = 'button'
}: ButtonProps) {
    const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
    const combinedClasses = `group ${baseClasses} ${className}`

    const content = (
        <>
            {iconLeft && <span className="mr-2">{iconLeft}</span>}
            {children}
            {iconRight ? (
                <span className="ml-2">{iconRight}</span>
            ) : showArrow ? (
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            ) : null}
        </>
    )

    if (href) {
        return (
            <Link href={href} className={combinedClasses}>
                {content}
            </Link>
        )
    }

    return (
        <button type={type} onClick={onClick} className={combinedClasses}>
            {content}
        </button>
    )
}
