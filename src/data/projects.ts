import { Project } from "@/types";

export const fallbackProjects: Project[] = [
  {
    id: "1",
    title: "SaaS Dashboard",
    description: "Real-time analytics dashboard with role-based access.",
    techStack: ["Next.js", "Supabase", "Tailwind", "Edge Functions"],
    liveUrl: "https://example.com/dashboard",
    repoUrl: "https://github.com/yourname/dashboard",
    images: ["/projects/dashboard-1.png", "/projects/dashboard-2.png"],
    featured: true,
    published: true,
    order: 1
  },
  {
    id: "2",
    title: "E-commerce Headless Store",
    description: "Headless commerce with Stripe payments and CMS-driven catalog.",
    techStack: ["Next.js", "Stripe", "Hygraph", "Tailwind"],
    liveUrl: "https://example.com/store",
    repoUrl: "https://github.com/yourname/storefront",
    images: ["/projects/store-1.png", "/projects/store-2.png", "/projects/store-3.png"],
    featured: true,
    published: true,
    order: 2
  },
  {
    id: "3",
    title: "AI Resume Screener",
    description: "LLM-assisted resume screening with recruiter workflows.",
    techStack: ["Next.js", "OpenAI", "Postgres", "Tailwind"],
    liveUrl: "https://example.com/ai",
    repoUrl: "https://github.com/yourname/ai-screener",
    images: ["/projects/ai-1.png", "/projects/ai-2.png"],
    published: true,
    order: 3
  },
  {
    id: "4",
    title: "Design System Kit",
    description: "Token-driven design system with accessible components.",
    techStack: ["Storybook", "TypeScript", "Tailwind"],
    liveUrl: "https://example.com/design",
    repoUrl: "https://github.com/yourname/design-system",
    images: ["/projects/design-1.png", "/projects/design-2.png"],
    published: true,
    order: 4
  },
  {
    id: "5",
    title: "Realtime Chat",
    description: "End-to-end encrypted chat with optimistic UI.",
    techStack: ["Next.js", "Supabase Realtime", "Tailwind"],
    liveUrl: "https://example.com/chat",
    repoUrl: "https://github.com/yourname/chat",
    images: ["/projects/chat-1.png", "/projects/chat-2.png", "/projects/chat-3.png"],
    published: true,
    order: 5
  }
];






