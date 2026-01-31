import { Linkedin, Github, Mail, Phone } from "lucide-react";

const socials = [
  { href: "https://www.linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "mailto:rimaz@example.com", icon: Mail, label: "Gmail" },
  { href: "tel:+1234567890", icon: Phone, label: "Mobile" }
];

export const Footer = () => (
  <footer className="mx-auto max-w-6xl px-4 pb-10 lg:px-6">
    <div className="glass flex flex-col items-center justify-between gap-4 rounded-3xl border px-6 py-4 text-sm shadow-glass md:flex-row">
      <p>© Rimaz 2025. All Rights Reserved.</p>
      <div className="flex items-center gap-3">
        {socials.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            className="rounded-full p-2 hover:bg-white/10"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
  </footer>
);






