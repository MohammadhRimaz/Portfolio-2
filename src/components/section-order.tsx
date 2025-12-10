"use client";

import { useEffect, useState } from "react";

const baseOrder = ["about", "projects", "skills", "testimonials", "experience"] as const;
export type SectionKey = (typeof baseOrder)[number];

type Props = {
  onChange: (order: SectionKey[]) => void;
};

export const SectionOrderControl = ({ onChange }: Props) => {
  const [order, setOrder] = useState<SectionKey[]>(baseOrder as SectionKey[]);

  useEffect(() => {
    const saved = localStorage.getItem("section-order");
    if (saved) {
      const parsed = JSON.parse(saved) as SectionKey[];
      setOrder(parsed);
      onChange(parsed);
    }
  }, [onChange]);

  const move = (index: number, dir: -1 | 1) => {
    const next = [...order];
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    onChange(next);
    localStorage.setItem("section-order", JSON.stringify(next));
  };

  return (
    <div className="glass flex flex-wrap items-center gap-2 rounded-2xl border px-3 py-2 text-xs shadow-glass">
      <span className="font-semibold">Section order:</span>
      {order.map((key, idx) => (
        <span key={key} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
          {key}
          <button
            className="text-cyan-200 disabled:opacity-40"
            onClick={() => move(idx, -1)}
            disabled={idx === 0}
            aria-label={`Move ${key} up`}
          >
            ↑
          </button>
          <button
            className="text-cyan-200 disabled:opacity-40"
            onClick={() => move(idx, 1)}
            disabled={idx === order.length - 1}
            aria-label={`Move ${key} down`}
          >
            ↓
          </button>
        </span>
      ))}
    </div>
  );
};


