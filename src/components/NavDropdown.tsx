'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, Zap, FileSearch } from 'lucide-react';

const appsMenuItems = [
  {
    href: '/apps/ai-radar',
    label: 'AI Radar',
    description: 'Aktuelle KI-News & Updates',
    icon: <Zap className="w-4 h-4 text-accent" />,
    external: false,
  },
  {
    href: 'https://ai-resume-analyzer-wheat-nine.vercel.app/',
    label: 'Resumind',
    description: 'KI-gestützter Lebenslauf-Analyzer',
    icon: <FileSearch className="w-4 h-4 text-accent" />,
    external: true,
  },
];

export default function NavDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1 text-foreground hover:text-muted-custom transition-colors uppercase text-sm font-medium tracking-wide"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Apps & Tools
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-3 bg-background border border-border-custom rounded-xl shadow-xl min-w-56 py-2 z-50">
          {appsMenuItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors group"
              >
                <div className="mt-0.5 shrink-0">{item.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors uppercase tracking-wide">
                    {item.label}
                  </div>
                  <div className="text-xs text-muted-custom mt-0.5">{item.description}</div>
                </div>
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors group"
              >
                <div className="mt-0.5 shrink-0">{item.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors uppercase tracking-wide">
                    {item.label}
                  </div>
                  <div className="text-xs text-muted-custom mt-0.5">{item.description}</div>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
