"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme !== "light";

  return (
    <button
      aria-label="Toggle theme"
      className={cn(
        "glass rounded-full p-2 transition hover:scale-105",
        "text-slate-100 dark:text-slate-100"
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {!mounted ? null : isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};





