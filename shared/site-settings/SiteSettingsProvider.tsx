"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { SiteSettings } from "./types";

const SiteSettingsContext = createContext<{ settings: SiteSettings | null; status: number | null }>({ settings: null, status: null });

export function SiteSettingsProvider({ settings, children }: { settings: SiteSettings | null; children: ReactNode }) {
  const value = useMemo(() => ({ settings, status: settings ? 200 : null }), [settings]);
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}
export function useSiteSettings() { return useContext(SiteSettingsContext); }
