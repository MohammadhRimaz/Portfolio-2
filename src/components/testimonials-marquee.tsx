"use client";

import { Testimonial } from "@/types";

type Props = {
  testimonials: Testimonial[];
};

export const TestimonialsMarquee = ({ testimonials }: Props) => {
  const doubled = [...testimonials, ...testimonials];
  return (
    <div className="overflow-hidden">
      <div
        className="flex min-w-full gap-4 animate-[marquee_18s_linear_infinite]"
        aria-label="Testimonials carousel"
      >
        {doubled.map((t, idx) => (
          <article
            key={`${t.id}-${idx}`}
            className="glass min-w-[320px] max-w-[360px] flex-1 rounded-2xl border p-4 shadow-glass"
          >
            <p className="text-sm text-slate-200">{t.message}</p>
            <div className="mt-3 text-xs uppercase tracking-wide text-cyan-200">
              {t.name} · {t.role}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};




