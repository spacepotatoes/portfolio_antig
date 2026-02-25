'use client';

import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Image as ImageIcon,
  Video,
  Code,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  Clock,
  ChevronRight,
  Zap,
  AlertCircle,
  Info,
  ShieldCheck
} from 'lucide-react';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '';

interface News {
  image: NewsItem[];
  video: NewsItem[];
  coding: NewsItem[];
}

interface NewsItem {
  title: string;
  summary: string;
  source?: string;
  url: string;
  tags?: string[];
  date?: string;
}

export default function AIRadar() {
  const [news, setNews] = useState<News>({
    image: [],
    video: [],
    coding: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  /**
   * Kern-Funktion für den API-Aufruf an Gemini 2.5 Flash.
   * Implementiert Exponential Backoff für maximale Stabilität bei Rate Limits.
   */
  const fetchGeminiNews = async (categoryQuery: string, retryCount = 0): Promise<NewsItem[]> => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = "Du bist ein KI-Nachrichten-Bot. Deine Aufgabe ist es, die aktuellsten News der letzten 7 Tage zu finden. Antworte ausschließlich im JSON-Format. Das JSON muss ein Objekt mit einem Array 'articles' sein. Jedes Objekt im Array benötigt: title, summary, source, url (echte Links!), tags (Array) und date.";

    const payload = {
      contents: [{
        parts: [{ text: categoryQuery }]
      }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            articles: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  source: { type: "string" },
                  url: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                  date: { type: "string" }
                },
                required: ["title", "summary", "url"]
              }
            }
          }
        }
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          body: errorData,
        });

        if (response.status === 401) {
          throw new Error("Authentifizierungsfehler (401). Der API-Schlüssel konnte nicht validiert werden. Bitte lade die Seite neu oder klicke auf 'News aktualisieren'.");
        }

        if (response.status === 403) {
          throw new Error("Zugriff verweigert (403). Die API könnte nicht aktiviert sein oder der API-Key hat nicht die richtige Berechtigung.");
        }

        if (response.status === 429 && retryCount < 5) {
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchGeminiNews(categoryQuery, retryCount + 1);
        }

        throw new Error(`API Fehler: ${response.status} (${response.statusText})`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) return [];

      const parsed = JSON.parse(text);
      return parsed.articles || [];
    } catch (err) {
      console.error("Fetch Error:", err);
      throw err;
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    setError(null);

    const queries = {
      image: "Finde die neuesten Releases für KI-Bildmodelle (z.B. Flux.1, Midjourney v6.1, neue Stable Diffusion Lora) der letzten 7 Tage. Was sind die Top-Themen auf Hugging Face?",
      video: "Suche nach neuen KI-Videomodellen wie Sora, Kling, Luma Dream Machine oder Runway Gen-3. Welche neuen Features wurden diese Woche veröffentlicht?",
      coding: "Finde News zu Coding-KIs: Neue Claude 3.5 Sonnet Benchmarks, DeepSeek V2.5, GitHub Copilot Extensions oder neue Open-Source-LLMs für Entwickler."
    };

    try {
      const results: any = {};
      for (const [key, query] of Object.entries(queries)) {
        try {
          results[key] = await fetchGeminiNews(query);
        } catch (e) {
          console.warn(`Fehler beim Abruf von ${key}:`, e);
          results[key] = [];
          if (!error) setError((e as Error).message);
        }
      }

      setNews(results);
      setLastUpdated(new Date().toLocaleTimeString('de-DE'));
    } catch (err) {
      setError("Datenabruf fehlgeschlagen. Bitte prüfe die API-Verbindung.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div className="w-full">
      {/* Header / Navbar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border-custom px-6 py-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-linear-to-tr from-accent via-blue-400 to-accent/70 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">AI RADAR</h2>
              <div className="text-xs text-muted-custom font-medium">KI-News & Updates</div>
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
              {loading ? 'Aktualisiert...' : 'Aktualisieren'}
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-600 dark:text-red-400 text-sm">Verbindungsfehler</h3>
            <p className="text-sm text-muted-custom mt-1 leading-relaxed">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Categories Tab Bar */}
      <div className="flex gap-2 mb-8 p-1 bg-surface rounded-lg w-fit border border-border-custom">
        {[
          { id: 'image', label: 'Bild-KI', icon: <ImageIcon className="w-4 h-4" /> },
          { id: 'video', label: 'Video-KI', icon: <Video className="w-4 h-4" /> },
          { id: 'coding', label: 'Dev & Coding', icon: <Code className="w-4 h-4" /> }
        ].map(tab => (
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

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-72 bg-surface border border-border-custom rounded-xl animate-pulse p-6">
              <div className="w-20 h-3 bg-surface-hover rounded-full mb-4"></div>
              <div className="w-full h-5 bg-surface-hover rounded-full mb-3"></div>
              <div className="w-3/4 h-5 bg-surface-hover rounded-full mb-6"></div>
              <div className="space-y-2">
                <div className="h-2 bg-surface-hover rounded-full w-full"></div>
                <div className="h-2 bg-surface-hover rounded-full w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news[activeTab as keyof News]?.length > 0 ? (
            news[activeTab as keyof News].map((item, idx) => (
              <article
                key={idx}
                className="group flex flex-col bg-surface border border-border-custom rounded-xl p-6 transition-all hover:bg-surface-hover hover:border-accent hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="relative z-10 flex justify-between items-start mb-4 gap-4">
                  <span className="text-xs font-bold text-accent uppercase tracking-wide shrink-0">
                    {item.source || 'News'}
                  </span>
                  {item.date && (
                    <span className="text-xs text-muted-custom font-medium">
                      {item.date}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-foreground mb-3 group-hover:text-accent transition-colors leading-snug line-clamp-2 relative z-10">
                  {item.title}
                </h3>

                <p className="text-sm text-muted-custom leading-relaxed mb-4 grow line-clamp-3 relative z-10">
                  {item.summary}
                </p>

                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                  {item.tags?.slice(0, 2).map((tag, tIdx) => (
                    <span key={tIdx} className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full border border-accent/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-semibold text-accent group/link border-t border-border-custom pt-4 hover:text-accent transition-colors relative z-10"
                >
                  MEHR LESEN
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              </article>
            ))
          ) : (
            !loading && !error && (
              <div className="col-span-full text-center py-16 bg-surface border border-dashed border-border-custom rounded-xl">
                <Info className="w-12 h-12 text-muted-custom/50 mx-auto mb-4" />
                <h3 className="text-foreground font-semibold mb-2">Keine Daten verfügbar</h3>
                <p className="text-muted-custom text-sm max-w-xs mx-auto">
                  Für diese Kategorie gibt es momentan keine News. Versuche es mit einer anderen Kategorie.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
