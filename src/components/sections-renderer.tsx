"use client";

import { useMemo, useState } from "react";
import { ProjectsSection } from "./projects-section";
import { TestimonialsMarquee } from "./testimonials-marquee";
import { ExperienceTimeline } from "./experience-timeline";
import { Section } from "./section";
import { ContactForm } from "./contact-form";
import { SectionOrderControl, SectionKey } from "./section-order";
import { Project, Testimonial, Experience } from "@/types";

type Props = {
  projects: Project[];
  testimonials: Testimonial[];
  experiences: Experience[];
};

export const SectionsRenderer = ({
  projects,
  testimonials,
  experiences
}: Props) => {
  const [order, setOrder] = useState<SectionKey[]>([
    "about",
    "projects",
    "skills",
    "testimonials",
    "experience"
  ]);

  const sections = useMemo(
    () => ({
      about: (
        <Section id="about" title="About">
          <div className="grid gap-6">
            <p className="text-lg text-slate-200">
              I build fast, resilient web apps with Next.js, Tailwind, and Supabase. I focus on
              clean architecture, sensible DX, and shipping quickly with accessibility and
              performance in mind.
            </p>
          </div>
        </Section>
      ),
      projects: <ProjectsSection projects={projects} />,
      skills: (
        <Section id="skills" title="Qualifications · Skills · Achievements">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Frontend", items: ["Next.js", "React", "Tailwind", "Framer Motion"] },
              { title: "Backend", items: ["Supabase", "Postgres", "tRPC/REST", "Auth"] },
              { title: "Ops", items: ["Vercel", "CI/CD", "Monitoring", "A11y & Perf"] }
            ].map((col) => (
              <div key={col.title} className="glass rounded-2xl border p-4">
                <p className="text-sm font-semibold text-cyan-200">{col.title}</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-200">
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      ),
      testimonials: (
        <Section id="testimonials" title="Testimonials">
          <TestimonialsMarquee testimonials={testimonials} />
        </Section>
      ),
      experience: (
        <Section id="experience" title="Work Experience">
          <ExperienceTimeline items={experiences} />
        </Section>
      )
    }),
    [projects, testimonials, experiences]
  );

  return (
    <>
      <div className="mx-auto flex max-w-6xl justify-center px-4 pt-4 lg:px-6">
        <SectionOrderControl onChange={setOrder} />
      </div>
      {order.map((key) => (
        <div key={key}>{sections[key]}</div>
      ))}
      <Section id="contact" title="Contact">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <ContactForm />
          <div className="glass rounded-2xl border p-6 text-sm shadow-glass">
            <p className="text-xl font-semibold text-white">Let&apos;s work together</p>
            <p className="text-lg text-slate-200">Email: rimaz@example.com</p>
            <p
              className="mt-5 text-xl text-slate-200"
              style={{ fontFamily: "cursive" }}
            >
              “Simple, fast, reliable software is the best kind of signature.”
            </p>
          </div>
        </div>
      </Section>
    </>
  );
};

