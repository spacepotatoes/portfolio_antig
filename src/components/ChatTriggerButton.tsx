'use client'

import { MessageCircle } from 'lucide-react'

interface ChatTriggerButtonProps {
    projectTitle: string
}

export default function ChatTriggerButton({ projectTitle }: ChatTriggerButtonProps) {
    function handleClick() {
        const message = `Erkläre mir das Projekt "${projectTitle}" – was waren die Ziele, welche Technologien wurden eingesetzt und was macht es besonders?`
        window.dispatchEvent(new CustomEvent('open-chat', { detail: { message } }))
    }

    return (
        <button
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--background)' }}
        >
            <MessageCircle size={17} />
            Assistenten fragen
        </button>
    )
}
