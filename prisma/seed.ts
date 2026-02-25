import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const projects = [
        {
            title: "Moderner Online-Shop",
            description: "Ein minimalistischer E-Commerce-Auftritt mit Fokus auf UX.",
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
            category: "Webdesign",
            techStack: "Figma, Adobe XD, Tailwind CSS",
            persona: "Der qualitätsbewusste Online-Shopper, der Wert auf Geschwindigkeit und klares Design legt.",
            painPoints: "Lange Ladezeiten, komplizierter Checkout-Prozess, unübersichtliche Produktseiten.",
            userJourneyData: JSON.stringify([
                { label: 'Entdeckung', value: 20 },
                { label: 'Suche', value: 45 },
                { label: 'Auswahl', value: 30 },
                { label: 'Kauf', value: 65 },
                { label: 'Rückkehr', value: 80 }
            ]),
        },
        {
            title: "Branding für Tech-Startup",
            description: "Corporate Identity und Web-Konzept für ein KI-Unternehmen.",
            imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
            category: "Webdesign",
            techStack: "Illustrator, Photoshop, Next.js",
            persona: "Startup-Gründer, die eine innovative und vertrauenswürdige Marke aufbauen wollen.",
            painPoints: "Fehlende Differenzierung am Markt, inkonsistentes Branding, schwer verständliche Technologie.",
            userJourneyData: JSON.stringify([
                { label: 'Bekanntheit', value: 30 },
                { label: 'Interesse', value: 60 },
                { label: 'Vertrauen', value: 90 },
                { label: 'Loyalität', value: 50 }
            ]),
        },
        {
            title: "SaaS Dashboard Architecture",
            description: "Komplexe Daten-Visualisierung und Backend-Integration.",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
            category: "Webentwickler",
            techStack: "Next.js, TypeScript, Prisma, PostgreSQL",
            persona: "Datenanalysten, die komplexe Metriken in Echtzeit überwachen müssen.",
            painPoints: "Überladene Interfaces, langsame Datenaktualisierung, schwer zugängliche Filter.",
            userJourneyData: JSON.stringify([
                { label: 'Login', value: 80 },
                { label: 'Übersicht', value: 95 },
                { label: 'Datenanalyse', value: 40 },
                { label: 'Export', value: 60 }
            ]),
        },
        {
            title: "Echtzeit-Chat App",
            description: "Fullstack-Anwendung mit WebSockets und globalem State.",
            imageUrl: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80",
            category: "Webentwickler",
            techStack: "React, Socket.io, Node.js, Redis",
            persona: "Remote-Teams, die eine zuverlässige und schnelle Kommunikation benötigen.",
            painPoints: "Nachrichtenverzögerung, fehlende Benachrichtigungen, instabile Verbindungen.",
            userJourneyData: JSON.stringify([
                { label: 'Setup', value: 70 },
                { label: 'Messaging', value: 90 },
                { label: 'File Sharing', value: 50 },
                { label: 'Audio/Video', value: 30 }
            ]),
        },
        {
            title: "Alpine Gipfelwelten",
            description: "Naturfotografie in den Schweizer Alpen.",
            imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
            category: "Fotograf",
            techStack: "Sony A7R IV, 24-70mm f2.8",
            persona: "Abenteuerlustige Reisende und Naturliebhaber.",
            painPoints: "Zu viele Touristen, schlechte Ausrüstung, unvorhersehbares Wetter.",
            userJourneyData: JSON.stringify([
                { label: 'Planung', value: 40 },
                { label: 'Anreise', value: 20 },
                { label: 'Aufstieg', value: 10 },
                { label: 'Momentum', value: 95 }
            ]),
        },
        {
            title: "Urban Nightlife",
            description: "Street-Fotografie in den Straßen von Tokyo.",
            imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80",
            category: "Fotograf",
            techStack: "Leica M11, 35mm f1.4",
            persona: "Stadtentdecker und Kunstinteressierte.",
            painPoints: "Geringes Licht, überfüllte Straßen, Privatsphäre der Motive.",
            userJourneyData: JSON.stringify([
                { label: 'Location Scouting', value: 50 },
                { label: 'Authentizität', value: 80 },
                { label: 'Nachbearbeitung', value: 60 }
            ]),
        },
    ]

    console.log('Seeding projects...')

    for (const project of projects) {
        await prisma.project.create({
            data: project,
        })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
