'use client';

import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string | null;
  avatar?: string | null;
  rating: number;
  text: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-accent fill-accent' : 'text-border-custom fill-border-custom'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="shrink-0 w-80 bg-surface border border-border-custom rounded-2xl p-6 mx-3">
      <StarRating rating={item.rating} />
      <p className="text-sm text-muted-custom leading-relaxed mb-6 line-clamp-4">
        &ldquo;{item.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        {item.avatar ? (
          <Image
            src={item.avatar}
            alt={item.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <span className="text-accent font-bold text-sm">{item.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <div className="text-sm font-bold text-foreground">{item.name}</div>
          <div className="text-xs text-muted-custom">
            {item.role}{item.company ? ` · ${item.company}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  // Split into two rows
  const half = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, half);
  const row2 = testimonials.slice(half);

  // Duplicate for seamless loop
  const row1Loop = [...row1, ...row1, ...row1];
  const row2Loop = [...row2.length > 0 ? row2 : row1, ...(row2.length > 0 ? row2 : row1), ...(row2.length > 0 ? row2 : row1)];

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      {/* Row 1 – left */}
      <div className="flex mb-4 animate-marquee-left hover:[animation-play-state:paused]">
        {row1Loop.map((item, i) => (
          <TestimonialCard key={`r1-${i}`} item={item} />
        ))}
      </div>

      {/* Row 2 – right */}
      <div className="flex animate-marquee-right hover:[animation-play-state:paused]">
        {row2Loop.map((item, i) => (
          <TestimonialCard key={`r2-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
