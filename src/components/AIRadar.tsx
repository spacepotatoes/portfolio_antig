'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Clock,
  ChevronRight,
  Zap,
  AlertCircle,
  Info,
  Cpu,
  Wrench,
  GitBranch,
  Palette,
  Monitor,
} from 'lucide-react';

interface NewsItem {
  title: string;
  summary: string;
  source?: string;
  url: string;
  tags?: string[];
  date?: string;
  image?: string;
}

interface News {
  models: NewsItem[];
  tools: NewsItem[];
  opensource: NewsItem[];
  graphicdesign: NewsItem[];
  webdesign: NewsItem[];
}

export default function AIRadar() {
  const [news, setNews] = useState<News>({ models: [], tools: [], opensource: [], graphicdesign: [], webdesign: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('models');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai-radar');
      if (!res.ok) throw new Error(`Fehler beim Laden (${res.status})`);
      const data: News = await res.json();
      setNews(data);
      setLastUpdated(new Date().toLocaleTimeString('de-DE'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, []);

  const tabs = [
    { id: 'models', label: 'Neue Modelle', icon: <Cpu className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools & APIs', icon: <Wrench className="w-4 h-4" /> },
    { id: 'opensource', label: 'Open Source', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'graphicdesign', label: 'Grafikdesign', icon: <Palette className="w-4 h-4" /> },
    { id: 'webdesign', label: 'Webdesign', icon: <Monitor className="w-4 h-4" /> },
  ];

  const currentItems = news[activeTab as keyof News] ?? [];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border-custom px-6 py-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-linear-to-tr from-accent via-blue-400 to-accent/70 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">AI RADAR</h2>
              <div className="text-xs text-muted-custom font-medium">Neueste KI-Modelle & Tools – Live via RSS</div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {lastUpdated && !loading && (
              <div className="text-xs font-medium text-muted-custom bg-surface px-3 py-1 rounded-full border border-border-custom">
                <Clock className="w-3 h-3 inline mr-1" />
                {lastUpdated}
              </div>
            )}
            <button
              onClick={loadAllData}
              disabled={loading}
              className="group relative flex items-center gap-2 bg-accent text-white hover:opacity-90 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              {loading ? 'Lädt RSS-Feeds...' : 'Aktualisieren'}
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-600 dark:text-red-400 text-sm">Verbindungsfehler</h3>
            <p className="text-sm text-muted-custom mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-surface rounded-lg w-fit border border-border-custom">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-accent text-white shadow-md'
                : 'text-muted-custom hover:text-foreground hover:bg-surface-hover'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-72 bg-surface border border-border-custom rounded-xl animate-pulse p-6">
              <div className="w-20 h-3 bg-surface-hover rounded-full mb-4" />
              <div className="w-full h-5 bg-surface-hover rounded-full mb-3" />
              <div className="w-3/4 h-5 bg-surface-hover rounded-full mb-6" />
              <div className="space-y-2">
                <div className="h-2 bg-surface-hover rounded-full w-full" />
                <div className="h-2 bg-surface-hover rounded-full w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.length > 0 ? (
            currentItems.map((item, idx) => (
              <article
                key={idx}
                className="group flex flex-col bg-surface border border-border-custom rounded-xl transition-all hover:bg-surface-hover hover:border-accent hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Card Image */}
                {item.image && (
                  <div className="relative h-44 w-full overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="flex flex-col grow p-6">
                  <div className="relative z-10 flex justify-between items-start mb-4 gap-4">
                    <span className="text-xs font-bold text-accent uppercase tracking-wide shrink-0">
                      {item.source || 'News'}
                    </span>
                    {item.date && (
                      <span className="text-xs text-muted-custom font-medium">{item.date}</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-3 group-hover:text-accent transition-colors leading-snug line-clamp-2 relative z-10">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-custom leading-relaxed mb-4 grow line-clamp-3 relative z-10">
                    {item.summary}
                  </p>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                      {item.tags.slice(0, 2).map((tag, tIdx) => (
                        <span key={tIdx} className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full border border-accent/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs font-semibold text-accent border-t border-border-custom pt-4 hover:opacity-80 transition-opacity relative z-10"
                  >
                    MEHR LESEN
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            ))
          ) : (
            !error && (
              <div className="col-span-full text-center py-16 bg-surface border border-dashed border-border-custom rounded-xl">
                <Info className="w-12 h-12 text-muted-custom/50 mx-auto mb-4" />
                <h3 className="text-foreground font-semibold mb-2">Keine Daten</h3>
                <p className="text-muted-custom text-sm">Klicke auf „Aktualisieren" um die neuesten News zu laden.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
