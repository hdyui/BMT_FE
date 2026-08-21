"use client";

import { ThemeProvider } from "next-themes";

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-admin-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="bmt-admin-theme"
    >
      {children}
    </ThemeProvider>
  );
}
