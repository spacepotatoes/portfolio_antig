'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Smile, Meh, Frown } from 'lucide-react'

interface JourneyPoint {
  label: string
  value: number
}

interface UserJourneyChartProps {
  data: string | null
}

function EmotionBadge({ value }: { value: number }) {
  if (value >= 65) return (
    <div className="w-7 h-7 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
      <Smile className="w-4 h-4 text-green-500" />
    </div>
  )
  if (value >= 40) return (
    <div className="w-7 h-7 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center shrink-0">
      <Meh className="w-4 h-4 text-yellow-500" />
    </div>
  )
  return (
    <div className="w-7 h-7 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
      <Frown className="w-4 h-4 text-red-500" />
    </div>
  )
}

function sentimentColor(value: number) {
  if (value >= 65) return 'bg-green-500'
  if (value >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

export default function UserJourneyChart({ data }: UserJourneyChartProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!data) return null
  if (!mounted) return <div className="h-64 w-full bg-surface animate-pulse rounded-xl" />

  let journeyData: JourneyPoint[] = []
  try {
    journeyData = JSON.parse(data)
  } catch {
    return <p className="text-red-500 text-sm">Ungültige Diagrammdaten</p>
  }
  if (!journeyData.length) return null

  const isDark = theme === 'dark'
  const accent = isDark ? '#3b82f6' : '#0066cc'

  // SVG coordinate system
  const W = 800
  const H = 160
  const PAD_X = 30
  const PAD_Y = 16
  const cw = W - 2 * PAD_X
  const ch = H - 2 * PAD_Y
  const n = journeyData.length

  const pts = journeyData.map((d, i) => ({
    x: PAD_X + (n === 1 ? cw / 2 : (i / (n - 1)) * cw),
    y: PAD_Y + ((100 - d.value) / 100) * ch,
    ...d,
  }))

  // Smooth cubic bezier
  const linePath = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`
    const prev = pts[i - 1]
    const cpx = (prev.x + p.x) / 2
    return `${acc} C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`
  }, '')

  const fillPath = `${linePath} L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`

  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const gridStroke = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'

  return (
    <div className="w-full space-y-6">

      {/* ── Emotion Curve ── */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pb-1 pointer-events-none pr-2">
          {['100', '50', '0'].map(l => (
            <span key={l} className="text-[10px] text-muted-custom font-medium leading-none">{l}</span>
          ))}
        </div>

        <div className="pl-7">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ height: 'clamp(110px, 18vw, 170px)' }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Horizontal dashed grid */}
            {[0, 0.25, 0.5, 0.75, 1].map(t => {
              const yPos = PAD_Y + t * ch
              return (
                <line
                  key={t}
                  x1={PAD_X} y1={yPos} x2={W - PAD_X} y2={yPos}
                  stroke={gridColor}
                  strokeWidth="1"
                  strokeDasharray="5 5"
                />
              )
            })}

            {/* Vertical guides per stage */}
            {pts.map((p, i) => (
              <line
                key={i}
                x1={p.x} y1={PAD_Y} x2={p.x} y2={H}
                stroke={gridStroke}
                strokeWidth="1"
              />
            ))}

            {/* Fill under curve */}
            <path d={fillPath} fill={accent} fillOpacity="0.07" />

            {/* Curve */}
            <path
              d={linePath}
              fill="none"
              stroke={accent}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stage dots */}
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="6" fill={accent} fillOpacity="0.12" />
                <circle cx={p.x} cy={p.y} r="3.5" fill={accent} />
                <circle cx={p.x} cy={p.y} r="1.5" fill="white" fillOpacity="0.9" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* ── Stage Cards ── */}
      <div className="overflow-x-auto pb-1">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(80px, 1fr))`, minWidth: n > 6 ? `${n * 90}px` : undefined }}
        >
          {journeyData.map((d, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 px-2 py-3 rounded-xl bg-surface border border-border-custom text-center hover:border-accent/50 transition-colors"
            >
              <span className="text-[9px] font-bold text-muted-custom tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </span>

              <EmotionBadge value={d.value} />

              <p className="text-[10px] font-bold uppercase tracking-wide text-foreground leading-tight">
                {d.label}
              </p>

              <div className="flex items-center gap-1">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${sentimentColor(d.value)}`} />
                <span className="text-[10px] text-muted-custom font-semibold">{d.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-5 pt-1 border-t border-border-custom">
        {[
          { color: 'bg-green-500', label: 'Positiv ≥ 65%' },
          { color: 'bg-yellow-500', label: 'Neutral 40–64%' },
          { color: 'bg-red-500', label: 'Negativ < 40%' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] text-muted-custom font-medium">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
