import { Experience } from "@/types";

type Props = { items: Experience[] };

export const ExperienceTimeline = ({ items }: Props) => (
  <div className="grid gap-4 md:grid-cols-2">
    {items.map((exp) => (
      <article key={exp.id} className="glass rounded-2xl border p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-cyan-200">
          <span>
            {exp.start} – {exp.end}
          </span>
          <span>{exp.company}</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold">{exp.role}</h3>
        <p className="text-sm text-slate-200">{exp.summary}</p>
      </article>
    ))}
  </div>
);





