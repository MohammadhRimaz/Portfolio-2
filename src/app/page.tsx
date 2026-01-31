import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SectionsRenderer } from "@/components/sections-renderer";
import { getTestimonials, getExperiences } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [testimonials, experiences] = await Promise.all([
    getTestimonials(),
    getExperiences(),
  ]);

  return (
    <main className="min-h-screen">
      <div
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-slate-900/40 to-slate-950 pb-10"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,.22),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,.18),transparent_28%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-2 lg:px-6 lg:gap-6">
          <Header />
          <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/80 p-6 shadow-glass backdrop-blur dark:bg-white/5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:p-8">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">
                Full-Stack Developer
              </p>
              <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
                Building modern, resilient web apps with Next.js + Supabase.
              </h1>
              <p className="text-lg text-slate-200">
                I design and ship product-ready experiences: dashboards, SaaS,
                AI tools, and content sites with clean UI and smooth animations.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="glass rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-tight hover:scale-105"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-tight hover:border-cyan-300"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="glass relative overflow-hidden rounded-3xl border p-6 shadow-glass">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-pink-500/10" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
                  Highlights
                </p>
                <ul className="mt-3 space-y-3 text-sm text-slate-100">
                  <li>• 5+ years building SaaS with React/Next</li>
                  <li>• Supabase/Postgres + Vercel + Tailwind workflow</li>
                  <li>• Accessible, responsive, animated UI</li>
                  <li>• Edge-first APIs, image optimizations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionsRenderer testimonials={testimonials} experiences={experiences} />
      <Footer />
    </main>
  );
}
