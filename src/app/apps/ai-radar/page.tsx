import AIRadar from '@/components/AIRadar';
import { Zap, Image as ImageIcon, Video, Code, RefreshCw } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Radar | Apps & Tools',
  description: 'Echtzeit-Überblick über die neuesten Entwicklungen in der KI-Welt – Bild-KI, Video-KI und Coding-Tools.',
};

const features = [
  {
    icon: <ImageIcon className="w-5 h-5 text-accent" />,
    title: 'Bild-KI',
    desc: 'Neue Modelle wie Flux.1, Midjourney und Stable Diffusion – immer auf dem neuesten Stand.',
  },
  {
    icon: <Video className="w-5 h-5 text-accent" />,
    title: 'Video-KI',
    desc: 'Features und Releases von Sora, Kling, Luma Dream Machine und Runway Gen-3.',
  },
  {
    icon: <Code className="w-5 h-5 text-accent" />,
    title: 'Dev & Coding',
    desc: 'Benchmarks, neue Open-Source-LLMs und Updates zu GitHub Copilot, Claude & Co.',
  },
  {
    icon: <RefreshCw className="w-5 h-5 text-accent" />,
    title: 'Echtzeit-Updates',
    desc: 'Powered by Google Gemini – jederzeit auf Knopfdruck aktualisierbar.',
  },
];

export default function AIRadarPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 border-b border-border-custom">
        <span className="text-sm text-muted-custom font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          Apps & Tools
        </span>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-none">
              AI Radar
            </h1>
            <p className="text-xl text-muted-custom leading-relaxed">
              Der AI Radar ist ein Echtzeit-News-Aggregator für die KI-Branche. Er nutzt Googles
              Gemini-Sprachmodell, um die neuesten Entwicklungen in Bild-KI, Video-KI und
              Coding-Tools zu erfassen und übersichtlich darzustellen.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 lg:max-w-md w-full shrink-0">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-border-custom bg-surface hover:bg-surface-hover transition-colors"
              >
                <div className="mb-3">{f.icon}</div>
                <h3 className="text-sm font-bold mb-1 uppercase tracking-wide">{f.title}</h3>
                <p className="text-xs text-muted-custom leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-b border-border-custom">
        <h2 className="text-sm font-bold tracking-widest uppercase text-muted-custom mb-4">
          Wie funktioniert es?
        </h2>
        <p className="text-lg text-muted-custom max-w-3xl leading-relaxed">
          Bei jedem Aufruf oder Klick auf &ldquo;Aktualisieren&rdquo; sendet der AI Radar eine
          Anfrage an die Gemini-API von Google. Das Modell durchsucht sein Wissen nach den
          relevantesten KI-News der letzten 7 Tage und liefert strukturierte Artikel mit Titel,
          Zusammenfassung, Quelle und Tags zurück – immer kategoriespezifisch und auf Deutsch.
        </p>
      </section>

      {/* AI Radar Component */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-surface border border-border-custom rounded-3xl p-8 md:p-12">
          <AIRadar />
        </div>
      </section>
    </div>
  );
}
