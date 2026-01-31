"use client";

import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import { Project } from "@/types";

type Props = {
  project: Project;
  sticky?: boolean;
};

function normalizeImages(project: Project): string[] {
  const raw = project.images;
  if (Array.isArray(raw) && raw.length > 0) return raw;
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23475569' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

export const ProjectCard = ({ project, sticky }: Props) => {
  const images = normalizeImages(project);
  const mainImage = images[0] ?? PLACEHOLDER_IMAGE;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="glass group relative grid gap-4 rounded-3xl border p-5 shadow-glass lg:grid-cols-[1.2fr_1fr]"
    >
      <div className={sticky ? "lg:sticky lg:top-28" : ""}>
        <div className="relative overflow-hidden rounded-2xl border border-white/5">
          <img
            src={mainImage}
            alt={project.title}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, idx) => (
              <img
                key={`${img}-${idx}`}
                src={img}
                alt={`${project.title} ${idx + 1}`}
                className="h-20 w-32 flex-none rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <div className="flex items-center gap-2">
            <a
              href={project.liveUrl}
              className="glass inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs hover:scale-105"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={14} />
              Live
            </a>
            <a
              href={project.repoUrl}
              className="glass inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs hover:scale-105"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={14} />
              Code
            </a>
          </div>
        </div>
        <p className="text-sm text-slate-200">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {(Array.isArray(project.techStack) ? project.techStack : []).map(
            (tech) => (
              <span
                key={tech}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-cyan-200"
              >
                {tech}
              </span>
            ),
          )}
        </div>
      </div>
    </motion.article>
  );
};
