'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect, useMemo } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

const SUGGESTED_QUESTIONS = [
    'Was sind deine Spezialgebiete?',
    'Welche Projekte hast du gemacht?',
    'Wie kann ich dich kontaktieren?',
]

function getTextFromMessage(parts: { type: string; text?: string }[]) {
    return parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => p.text)
        .join('')
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), [])
    const { messages, sendMessage, status, error } = useChat({ transport })
    const isLoading = status === 'submitted' || status === 'streaming'

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        function onOpenChat(e: Event) {
            const { message } = (e as CustomEvent<{ message: string }>).detail
            setIsOpen(true)
            setTimeout(() => handleSend(message), 50)
        }
        window.addEventListener('open-chat', onOpenChat)
        return () => window.removeEventListener('open-chat', onOpenChat)
    }, [])

    function handleSend(text: string) {
        if (!text.trim() || isLoading) return
        sendMessage({ text })
        setInput('')
    }

    function handleSuggestedQuestion(q: string) {
        handleSend(q)
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        handleSend(input)
    }

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Chat öffnen"
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--background)' }}
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300"
                    style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--border)',
                        height: '520px',
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center gap-3 px-4 py-3 border-b"
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--accent)', color: 'var(--background)' }}
                        >
                            <Bot size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                Portfolio Assistent
                            </p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>
                                Frag mich alles über Giuseppe
                            </p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                            <span className="text-xs" style={{ color: 'var(--muted)' }}>Online</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 && (
                            <div className="space-y-4">
                                <div className="flex gap-2.5">
                                    <div
                                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                                        style={{ backgroundColor: 'var(--accent)', color: 'var(--background)' }}
                                    >
                                        <Bot size={13} />
                                    </div>
                                    <div
                                        className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%] text-sm leading-relaxed"
                                        style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}
                                    >
                                        Hallo! 👋 Ich bin der Portfolio-Assistent von Giuseppe. Ich beantworte gerne Fragen über seine Projekte, Fähigkeiten und Erfahrungen.
                                    </div>
                                </div>

                                <div className="space-y-2 pt-1">
                                    <p className="text-xs px-1" style={{ color: 'var(--muted)' }}>Vorschläge:</p>
                                    {SUGGESTED_QUESTIONS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => handleSuggestedQuestion(q)}
                                            className="w-full text-left text-xs px-3 py-2 rounded-xl border transition-all hover:opacity-80"
                                            style={{
                                                borderColor: 'var(--accent)',
                                                color: 'var(--accent)',
                                                backgroundColor: 'transparent',
                                            }}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div
                                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                                    style={{
                                        backgroundColor: msg.role === 'user' ? 'var(--surface-hover)' : 'var(--accent)',
                                        color: msg.role === 'user' ? 'var(--foreground)' : 'var(--background)',
                                    }}
                                >
                                    {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                                </div>
                                <div
                                    className="rounded-2xl px-3.5 py-2.5 max-w-[85%] text-sm leading-relaxed"
                                    style={{
                                        backgroundColor: msg.role === 'user' ? 'var(--accent)' : 'var(--surface)',
                                        color: msg.role === 'user' ? 'var(--background)' : 'var(--foreground)',
                                        borderRadius: msg.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                                    }}
                                >
                                    {getTextFromMessage(msg.parts as { type: string; text?: string }[])}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-2.5">
                                <div
                                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--accent)', color: 'var(--background)' }}
                                >
                                    <Bot size={13} />
                                </div>
                                <div
                                    className="rounded-2xl rounded-tl-sm px-4 py-3"
                                    style={{ backgroundColor: 'var(--surface)' }}
                                >
                                    <span className="flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                className="w-1.5 h-1.5 rounded-full animate-bounce"
                                                style={{
                                                    backgroundColor: 'var(--muted)',
                                                    animationDelay: `${i * 0.15}s`,
                                                }}
                                            />
                                        ))}
                                    </span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                                Fehler: {error.message || 'Etwas ist schiefgelaufen.'}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-3 border-t flex gap-2"
                        style={{ borderColor: 'var(--border)' }}
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Stell eine Frage..."
                            disabled={isLoading}
                            className="flex-1 text-sm px-3.5 py-2.5 rounded-xl outline-none transition-all"
                            style={{
                                backgroundColor: 'var(--surface)',
                                color: 'var(--foreground)',
                                border: '1px solid var(--border)',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                            style={{ backgroundColor: 'var(--accent)', color: 'var(--background)' }}
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}
