import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemeName = "light" | "dark" | "emerald" | "topaz" | "sapphire" | "ruby";
export type ShapeName = "round" | "square";

export const THEMES: Array<{ id: ThemeName; label: string; swatch: string; desc: string }> = [
  { id: "light", label: "Light", swatch: "#ffffff", desc: "Clean minimal white." },
  { id: "dark", label: "Dark", swatch: "#1f2028", desc: "Cozy dark charcoal." },
  { id: "emerald", label: "Emerald", swatch: "#10b981", desc: "Fresh green accents." },
  { id: "topaz", label: "Topaz", swatch: "#f5b301", desc: "Warm golden amber." },
  { id: "sapphire", label: "Sapphire", swatch: "#2563eb", desc: "Rich royal blue." },
  { id: "ruby", label: "Ruby", swatch: "#c62828", desc: "Deep ruby red." },
];

/** Accent palette per theme — drives SpecularButton, ClickSpark and Ribbons. */
export const THEME_FX: Record<
  ThemeName,
  { accent: string; line: string; base: string; spark: string; ribbons: [string, string] }
> = {
  light:    { accent: "#ff4d4d", line: "#ffb3a1", base: "#ff4d4d", spark: "#ff4d4d", ribbons: ["#ff4d4d", "#ff8080"] },
  dark:     { accent: "#ffffff", line: "#ffffff", base: "#8a8a8a", spark: "#ffffff", ribbons: ["#ffffff", "#888888"] },
  emerald:  { accent: "#10b981", line: "#a7f3d0", base: "#10b981", spark: "#10b981", ribbons: ["#10b981", "#6ee7b7"] },
  topaz:    { accent: "#f59e0b", line: "#fde68a", base: "#f59e0b", spark: "#f59e0b", ribbons: ["#f59e0b", "#fcd34d"] },
  sapphire: { accent: "#2563eb", line: "#bfdbfe", base: "#2563eb", spark: "#2563eb", ribbons: ["#2563eb", "#93c5fd"] },
  ruby:     { accent: "#dc2626", line: "#fecaca", base: "#dc2626", spark: "#dc2626", ribbons: ["#dc2626", "#fca5a5"] },
};

interface Ctx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  shape: ShapeName;
  setShape: (s: ShapeName) => void;
}
const ThemeCtx = createContext<Ctx>({ theme: "light", setTheme: () => {}, shape: "round", setShape: () => {} });

const KEY = "kk_theme";
const SHAPE_KEY = "kk_shape";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("light");
  const [shape, setShapeState] = useState<ShapeName>("round");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as ThemeName | null;
      if (saved) setThemeState(saved);
      const savedShape = localStorage.getItem(SHAPE_KEY) as ShapeName | null;
      if (savedShape === "round" || savedShape === "square") setShapeState(savedShape);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-shape", shape);
  }, [shape]);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    try { localStorage.setItem(KEY, t); } catch {}
  };

  const setShape = (s: ShapeName) => {
    setShapeState(s);
    try { localStorage.setItem(SHAPE_KEY, s); } catch {}
  };

  const value = useMemo(() => ({ theme, setTheme, shape, setShape }), [theme, shape]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);

/** Accent colors + button radius for the currently active theme/shape. */
export function useThemeFx() {
  const { theme, shape } = useTheme();
  return useMemo(
    () => ({ ...THEME_FX[theme] ?? THEME_FX.light, radius: shape === "square" ? 2 : 18 }),
    [theme, shape],
  );
}
