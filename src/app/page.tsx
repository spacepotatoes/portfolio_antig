import { getProjects } from '@/app/actions/projects'
import { getTestimonials } from '@/app/actions/testimonials'
import ProjectGrid from '@/components/ProjectGrid'
import Button from '@/components/Button'
import AIRadar from '@/components/AIRadar'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import Image from 'next/image'
import { Mail, Github, Linkedin, Instagram, Code, Palette, Rocket, Sparkles, Zap, Quote } from 'lucide-react'

const BehanceIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.836 1.98 2.21 1.98.785 0 1.339-.4 1.55-.926h3.995zm-7.737-3.35h3.938c-.088-1.214-.883-1.93-1.96-1.93-1.11 0-1.81.737-1.978 1.93zM8.433 12.5c.983-.374 1.567-1.072 1.567-2.17C10 8.246 8.857 7 6.5 7H1v13h5.907C9.547 20 11 18.623 11 16.37c0-1.454-.72-2.98-2.567-3.87zM3.5 9.5h2.5c.714 0 1.5.381 1.5 1.5s-.786 1.5-1.5 1.5H3.5V9.5zm0 5.5h2.764c.966 0 1.736.485 1.736 1.5S7.23 18 6.264 18H3.5v-3z" />
  </svg>
)

interface HomeProps {
  searchParams: Promise<{ category?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const activeCategory = params.category || 'all'
  const projects = await getProjects().catch(() => [])
  const testimonials = await getTestimonials().catch(() => [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center px-6 pt-20 overflow-hidden">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-56 w-80 h-80 hidden lg:block">
          <Image
            src="/Giuseppe_illustration_designers_studio Kopie.webp"
            alt="Giuseppe Illustration"
            width={400}
            height={400}
            className="w-full h-full object-cover opacity-80 rounded-3xl"
            priority
          />
        </div>

        <div className="relative z-10 text-center max-w-5xl -translate-y-4">
          <div className="mb-12 flex justify-center">
            <span className="badge-pill">Verfügbar für Projekte</span>
          </div>

          <h1 className="mb-8 flex flex-col items-center">
            <span className="hero-title-main">Kreativer Designer</span>
            <span className="hero-title-sub">& Entwickler</span>
          </h1>

          <p className="text-xl text-muted-custom max-w-2xl mx-auto mb-12 leading-relaxed">
            Schöne digitale Erlebnisse mit sauberem Code und durchdachtem Design.
            Spezialisiert auf moderne Webanwendungen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="#work" showArrow>Meine Arbeiten</Button>
            <Button href="/contact" variant="secondary">Kontakt aufnehmen</Button>
          </div>
        </div>

        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-56 w-80 h-80 hidden lg:block">
          <Image
            src="/Giuseppe_illustration_interlocked_02 Kopie.webp"
            alt="Giuseppe Illustration"
            width={400}
            height={400}
            className="w-full h-full object-cover opacity-80 rounded-3xl"
            priority
          />
        </div>
      </section>



      {/* Projects Section */}
      <section id="work" className="max-w-7xl mx-auto px-6 pb-24">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-border-custom pb-8">
          <div>
            <span className="text-sm text-muted-custom font-bold tracking-widest uppercase mb-2 block">Ausgewählte Projekte</span>
            <h2 className="text-4xl font-bold capitalize">
              {activeCategory === 'all' ? 'Alle Arbeiten' : activeCategory}
            </h2>
          </div>
          <div className="text-muted-custom text-sm italic">
            {activeCategory === 'fotograf' ? 'Klicken für volle Ansicht' : 'Hover für Tech-Stack'}
          </div>
        </header>

        <ProjectGrid initialProjects={projects} activeCategory={activeCategory} />
      </section>

      {/* About Me Section */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-32 border-t border-border-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Über mich</h2>
            <div className="space-y-6 text-lg text-muted-custom leading-relaxed font-medium text-pretty">
              <p>
                Ich bin ein kreativer Entwickler mit einer Leidenschaft für schöne, funktionale digitale Erlebnisse.
                Mit über 5 Jahren Erfahrung verbinde ich Design-Thinking mit technischer Expertise.
              </p>
              <p>
                Mein Ansatz fokussiert sich auf sauberen Code, durchdachtes Design und Lösungen, die nicht nur
                großartig aussehen, sondern auch außergewöhnlich performen.
              </p>
              <p>
                Wenn ich nicht code, erforsche ich neue Design-Trends, bringe mich in Open-Source-Projekte ein
                oder teile mein Wissen mit der Entwickler-Community.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <Code size={24} />, title: "Entwicklung", desc: "React, TypeScript, Node.js und moderne Web-Technologien" },
              { icon: <Palette size={24} />, title: "Design", desc: "UI/UX-Design, Prototyping und Design-Systeme" },
              { icon: <Rocket size={24} />, title: "Performance", desc: "Optimierte, schnell ladende und barrierefreie Anwendungen" },
              { icon: <Sparkles size={24} />, title: "Innovation", desc: "Kreative Lösungen mit modernsten Technologien" }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl border border-border-custom bg-surface/50 hover:bg-surface transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-custom text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apps & Tools Section */}
      <section id="apps" className="max-w-7xl mx-auto px-6 py-32 border-t border-border-custom">
        <div className="mb-16">
          <span className="text-sm text-muted-custom font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            Nützliche Tools
          </span>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Apps & Tools
          </h2>
          <p className="text-lg text-muted-custom mt-4 max-w-2xl">
            Eine Sammlung von praktischen Anwendungen und Tools, die ich entwickelt habe, um Workflows zu optimieren und Produktivität zu steigern.
          </p>
        </div>

        <div className="bg-surface border border-border-custom rounded-3xl p-8 md:p-12">
          <AIRadar />
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 border-t border-border-custom overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-14">
            <div className="flex items-center gap-3 mb-3">
              <Quote className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-custom font-bold tracking-widest uppercase">Kundenstimmen</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Was Kunden sagen
            </h2>
          </div>
          <TestimonialsCarousel testimonials={testimonials} />
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Lass uns zusammenarbeiten</h2>
          <p className="text-muted-custom text-lg md:text-xl mb-12 leading-relaxed font-medium">
            Hast du ein Projekt im Sinn? Ich freue mich, davon zu hören.<br />
            Lass uns gemeinsam etwas Großartiges erschaffen.
          </p>

          <div className="flex flex-col items-center gap-12">
            <Button
              href="mailto:hello@giuseppe-troiano.de"
              iconLeft={<Mail className="w-5 h-5" />}
            >
              Schreib mir
            </Button>

            <div className="flex items-center justify-center gap-4">
              <a href="https://www.behance.net/giuseppetroiano4" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl border border-border-custom hover:bg-surface transition-all active:scale-95">
                <BehanceIcon />
              </a>
              <a href="https://www.instagram.com/_giuseppetroiano" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl border border-border-custom hover:bg-surface transition-all active:scale-95">
                <Instagram size={20} className="text-foreground" />
              </a>
              <a href="https://github.com/spacepotatoes" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl border border-border-custom hover:bg-surface transition-all active:scale-95">
                <Github size={20} className="text-foreground" />
              </a>
              <a href="https://www.linkedin.com/in/giuseppe-troiano-759941186/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl border border-border-custom hover:bg-surface transition-all active:scale-95">
                <Linkedin size={20} className="text-foreground" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
