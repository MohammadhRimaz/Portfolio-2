 "use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: Props) => (
  <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    {children}
  </NextThemeProvider>
);






