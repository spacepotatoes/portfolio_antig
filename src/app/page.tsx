import { getProjects } from '@/app/actions/projects'
import ProjectGrid from '@/components/ProjectGrid'
import Button from '@/components/Button'
import AIRadar from '@/components/AIRadar'
import Image from 'next/image'
import { Mail, Github, Linkedin, Twitter, Code, Palette, Rocket, Sparkles, Zap } from 'lucide-react'

interface HomeProps {
  searchParams: Promise<{ category?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const activeCategory = params.category || 'all'
  const projects = await getProjects()

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
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">About Me</h2>
            <div className="space-y-6 text-lg text-muted-custom leading-relaxed font-medium text-pretty">
              <p>
                I&apos;m a creative developer with a passion for building beautiful, functional digital experiences.
                With over 5 years of experience, I blend design thinking with technical expertise.
              </p>
              <p>
                My approach focuses on clean code, thoughtful design, and creating solutions that not only
                look great but perform exceptionally well.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me exploring new design trends, contributing
                to open source, or sharing knowledge with the developer community.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <Code size={24} />, title: "Development", desc: "React, TypeScript, Node.js, and modern web technologies" },
              { icon: <Palette size={24} />, title: "Design", desc: "UI/UX design, prototyping, and design systems" },
              { icon: <Rocket size={24} />, title: "Performance", desc: "Optimized, fast-loading, and accessible applications" },
              { icon: <Sparkles size={24} />, title: "Innovation", desc: "Creative solutions with cutting-edge technologies" }
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

      {/* Contact CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Let's Work Together</h2>
          <p className="text-muted-custom text-lg md:text-xl mb-12 leading-relaxed font-medium">
            Have a project in mind? I'd love to hear about it.<br />
            Let's create something amazing together.
          </p>

          <div className="flex flex-col items-center gap-12">
            <Button
              href="mailto:contact@antigravity.ai"
              iconLeft={<Mail className="w-5 h-5" />}
            >
              Get in Touch
            </Button>

            <div className="flex items-center justify-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl border border-border-custom hover:bg-surface transition-all active:scale-95">
                <Github size={20} className="text-foreground" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl border border-border-custom hover:bg-surface transition-all active:scale-95">
                <Linkedin size={20} className="text-foreground" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl border border-border-custom hover:bg-surface transition-all active:scale-95">
                <Twitter size={20} className="text-foreground" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
