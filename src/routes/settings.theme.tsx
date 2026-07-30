import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useTheme, THEMES } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import SpecularButton from "@/components/SpecularButton";

export const Route = createFileRoute("/settings/theme")({
  head: () => ({
    meta: [
      { title: "Theme — Kabir's Kitchen" },
      { name: "description", content: "Choose from 6 poppy themes for the app." },
      { property: "og:title", content: "Theme — Kabir's Kitchen" },
      { property: "og:description", content: "Pick your theme." },
    ],
  }),
  component: ThemePage,
});

function ThemePage() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <h2 className="mb-2 text-2xl font-black">Theme</h2>
      <p className="mb-6 text-sm text-muted-foreground">Pick a look. Applies instantly across the whole app.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {THEMES.map((t) => {
          const active = theme === t.id;
          return (
            <SpecularButton
              key={t.id}
              onClick={() => setTheme(t.id)}
              data-theme={t.id}
              className={cn(
                "group relative overflow-hidden rounded-3xl border-2 p-4 text-left transition-transform hover:scale-[1.02]",
                active ? "border-primary shadow-lg" : "border-border",
              )}
              style={{ background: "var(--background)", color: "var(--foreground)" }}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl text-lg font-black" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>K</div>
                <div>
                  <div className="text-base font-black">{t.label}</div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t.desc}</div>
                </div>
                {active && (
                  <div className="ml-auto grid h-7 w-7 place-items-center rounded-full" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-1.5">
                <span className="h-8 flex-1 rounded-lg" style={{ background: "var(--primary)" }} />
                <span className="h-8 flex-1 rounded-lg" style={{ background: "var(--accent)" }} />
                <span className="h-8 flex-1 rounded-lg" style={{ background: "var(--secondary)" }} />
                <span className="h-8 flex-1 rounded-lg" style={{ background: "var(--card)", border: "1px solid var(--border)" }} />
              </div>
            </SpecularButton>
          );
        })}
      </div>
    </div>
  );
}
