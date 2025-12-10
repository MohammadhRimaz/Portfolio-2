"use client";

import { useMemo, useState } from "react";
import { Project } from "@/types";
import { ProjectCard } from "./project-card";
import { Section } from "./section";

type Props = {
  projects: Project[];
};

export const ProjectsSection = ({ projects }: Props) => {
  const [visibleCount, setVisibleCount] = useState(4);
  const ordered = useMemo(
    () => projects.filter((p) => p.published).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [projects]
  );

  const visible = ordered.slice(0, visibleCount);
  const hasMore = visibleCount < ordered.length;

  return (
    <Section id="projects" title="Latest Projects">
      <div className="flex flex-col gap-6">
        {visible.map((project, idx) => (
          <ProjectCard key={project.id} project={project} sticky={idx === 0} />
        ))}
        {hasMore && (
          <button
            className="glass self-center rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-tight hover:scale-105"
            onClick={() => setVisibleCount((c) => c + 3)}
          >
            Load more
          </button>
        )}
      </div>
    </Section>
  );
};


