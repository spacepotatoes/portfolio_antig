import { streamText, convertToModelMessages, UIMessage } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const maxDuration = 30

function buildPortfolioContext(projects: Awaited<ReturnType<typeof prisma.project.findMany>>) {
    const projectList = projects.map((p) => {
        const parts = [
            `### ${p.title}`,
            `Kategorie: ${p.category}`,
            `Beschreibung: ${p.description}`,
            `Tech Stack: ${p.techStack}`,
        ]
        if (p.personaName) parts.push(`Zielgruppe/Persona: ${p.personaName} – ${p.personaBio ?? ''}`)
        if (p.painPoints) parts.push(`Pain Points: ${p.painPoints}`)
        if (p.empathySays) parts.push(`Persona sagt: "${p.empathySays}"`)
        return parts.join('\n')
    }).join('\n\n')

    return `
Du bist der persönliche Portfolio-Assistent von Giuseppe Troiano, einem Fullstack-Entwickler und Designer.
Deine Aufgabe ist es, Fragen über Giuseppe, seine Fähigkeiten und seine Projekte zu beantworten.

Antworte immer auf Deutsch, außer der Nutzer schreibt auf Englisch – dann antworte auf Englisch.
Sei freundlich, kompetent und präzise. Halte Antworten kurz und klar, außer wenn Details gefragt werden.

## Über Giuseppe Troiano
- Fullstack-Entwickler & Designer mit Leidenschaft für moderne Webanwendungen
- Spezialisiert auf: React, TypeScript, Next.js, Tailwind CSS, Prisma, GSAP
- Philosophie: Sauberer Code + durchdachtes Design = exzellente digitale Erlebnisse
- Verfügbar für neue Projekte

## Seine Projekte (${projects.length} insgesamt)

${projectList || 'Noch keine Projekte vorhanden.'}

## Wichtige Hinweise
- Wenn nach Kontakt gefragt wird: Verweise auf das Kontaktformular auf der Seite oder contact@antigravity.ai
- Wenn nach Preisen gefragt wird: Erkläre, dass das individuell besprochen werden muss
- Bleib sachlich und professionell
`.trim()
}

export async function POST(req: Request) {
    if (!process.env.ANTHROPIC_API_KEY) {
        return new Response('ANTHROPIC_API_KEY is not configured.', { status: 500 })
    }

    const { messages }: { messages: UIMessage[] } = await req.json()

    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
    })

    const anthropic = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
        model: anthropic('claude-haiku-4-5-20251001'),
        system: buildPortfolioContext(projects),
        messages: modelMessages,
        maxOutputTokens: 600,
    })

    return result.toUIMessageStreamResponse()
}
