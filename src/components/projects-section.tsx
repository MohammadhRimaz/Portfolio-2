"use client";

import { useEffect, useMemo, useState } from "react";
import { Project } from "@/types";
import { ProjectCard } from "./project-card";
import { Section } from "./section";
import { supabase } from "@/lib/supabaseClient";
import { fallbackProjects } from "@/data/projects";

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 4;

function normalizeProject(row: Record<string, unknown>): Project {
  const raw = row.images ?? row.image;
  let imagesArray: string[] = [];
  if (Array.isArray(raw)) {
    imagesArray = raw.filter(
      (u): u is string => typeof u === "string" && u.length > 0,
    );
  } else if (typeof raw === "string" && raw.trim()) {
    imagesArray = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    techStack: Array.isArray(row.techStack) ? (row.techStack as string[]) : [],
    liveUrl: String(row.liveUrl ?? row.liveurl),
    repoUrl: String(row.repoUrl ?? row.repourl),
    images: imagesArray as string[],
    published: Boolean(row.published),
    inserted_at: row.inserted_at != null ? String(row.inserted_at) : undefined,
  } as Project;
}

async function fetchProjects(): Promise<Project[]> {
  if (!supabase) return fallbackProjects;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("inserted_at", { ascending: false });
  if (error || !data) return fallbackProjects;
  return (data as Record<string, unknown>[]).map(normalizeProject);
}

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProjects().then((data) => {
      if (!cancelled) {
        setProjects(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
        {loading ? (
          <p className="text-center text-sm text-slate-400">
            Loading projects…
          </p>
        ) : (
          <>
            {visible.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                sticky={idx === 0}
              />
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
          </>
        )}
      </div>
    </Section>
  );
};
