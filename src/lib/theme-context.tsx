import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeName = "light" | "dark" | "emerald" | "topaz" | "sapphire" | "ruby";

export const THEMES: Array<{ id: ThemeName; label: string; swatch: string; desc: string }> = [
  { id: "light", label: "Light", swatch: "#ffffff", desc: "Clean minimal white." },
  { id: "dark", label: "Dark", swatch: "#1f2028", desc: "Cozy dark charcoal." },
  { id: "emerald", label: "Emerald", swatch: "#10b981", desc: "Fresh green accents." },
  { id: "topaz", label: "Topaz", swatch: "#f5b301", desc: "Warm golden amber." },
  { id: "sapphire", label: "Sapphire", swatch: "#2563eb", desc: "Rich royal blue." },
  { id: "ruby", label: "Ruby", swatch: "#c62828", desc: "Deep ruby red." },
];

interface Ctx { theme: ThemeName; setTheme: (t: ThemeName) => void; }
const ThemeCtx = createContext<Ctx>({ theme: "light", setTheme: () => {} });

const KEY = "kk_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as ThemeName | null;
      if (saved) setThemeState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    try { localStorage.setItem(KEY, t); } catch {}
  };

  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
