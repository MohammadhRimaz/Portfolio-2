"use client";

import { useMemo, useState } from "react";
import { Project } from "@/types";
import { ProjectCard } from "./project-card";
import { Section } from "./section";

type Props = {
  projects: Project[];
};

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 4;

export const ProjectsSection = ({ projects }: Props) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const ordered = useMemo(() => {
    const published = projects.filter((p) => p.published);
    return [...published].sort((a, b) => {
      const aTime = a.inserted_at ? new Date(a.inserted_at).getTime() : 0;
      const bTime = b.inserted_at ? new Date(b.inserted_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [projects]);

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
            type="button"
            className="glass self-center rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-tight hover:scale-105"
            onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
          >
            Load more
          </button>
        )}
      </div>
    </Section>
  );
};
