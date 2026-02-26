import Link from 'next/link'
import Image from 'next/image'
import { Github, Instagram, Linkedin, Mail } from 'lucide-react'

const BehanceIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.836 1.98 2.21 1.98.785 0 1.339-.4 1.55-.926h3.995zm-7.737-3.35h3.938c-.088-1.214-.883-1.93-1.96-1.93-1.11 0-1.81.737-1.978 1.93zM8.433 12.5c.983-.374 1.567-1.072 1.567-2.17C10 8.246 8.857 7 6.5 7H1v13h5.907C9.547 20 11 18.623 11 16.37c0-1.454-.72-2.98-2.567-3.87zM3.5 9.5h2.5c.714 0 1.5.381 1.5 1.5s-.786 1.5-1.5 1.5H3.5V9.5zm0 5.5h2.764c.966 0 1.736.485 1.736 1.5S7.23 18 6.264 18H3.5v-3z" />
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border-custom bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Logo & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block hover:opacity-70 transition-opacity">
              <Image
                src="/giuseppetroiano_logo_dark.png"
                alt="Giuseppe Troiano Logo"
                width={140}
                height={44}
                className="h-auto logo-image"
              />
            </Link>
            <p className="text-muted-custom text-sm leading-relaxed max-w-xs">
              Kreativer Designer & Entwickler — schöne digitale Erlebnisse mit sauberem Code und durchdachtem Design.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.behance.net/giuseppetroiano4"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-custom text-muted-custom hover:text-foreground hover:border-foreground transition-all active:scale-95"
              >
                <BehanceIcon />
              </a>
              <a
                href="https://www.instagram.com/_giuseppetroiano"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-custom text-muted-custom hover:text-foreground hover:border-foreground transition-all active:scale-95"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://github.com/spacepotatoes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-custom text-muted-custom hover:text-foreground hover:border-foreground transition-all active:scale-95"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/giuseppe-troiano-759941186/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-custom text-muted-custom hover:text-foreground hover:border-foreground transition-all active:scale-95"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-muted-custom">Projekte</h4>
            <ul className="space-y-3">
              {[
                { label: 'Alle Arbeiten', href: '/?category=all' },
                { label: 'Webdesign', href: '/?category=webdesign' },
                { label: 'Entwicklung', href: '/?category=webentwickler' },
                { label: 'Fotografie', href: '/?category=fotograf' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted-custom hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-muted-custom">Kontakt</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@antigravity.ai"
                  className="flex items-center gap-2 text-sm text-muted-custom hover:text-foreground transition-colors group"
                >
                  <Mail size={14} className="shrink-0" />
                  contact@antigravity.ai
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-custom hover:text-foreground transition-colors">
                  Kontaktformular
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-sm text-muted-custom hover:text-foreground transition-colors">
                  Über mich
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-custom pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-custom tracking-widest uppercase">
            © {year} Giuseppe Troiano
          </p>
          <p className="text-xs text-muted-custom tracking-widest uppercase">
            Designed & Built by Giuseppe Troiano
          </p>
        </div>

      </div>
    </footer>
  )
}
