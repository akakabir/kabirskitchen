import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SettingsHeader, useLocal } from "@/components/SettingsBits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/language")({
  head: () => ({ meta: [{ title: "Language — Settings" }, { name: "description", content: "Pick your app language." }] }),
  component: LanguagePage,
});

const LANGS = [
  { id: "en", label: "English", native: "English" },
  { id: "hi", label: "Hindi", native: "हिन्दी" },
  { id: "mr", label: "Marathi", native: "मराठी" },
  { id: "ta", label: "Tamil", native: "தமிழ்" },
  { id: "bn", label: "Bengali", native: "বাংলা" },
  { id: "ar", label: "Arabic", native: "العربية" },
];

function LanguagePage() {
  const [lang, setLang] = useLocal<string>("kk_language", "en");
  return (
    <div>
      <SettingsHeader title="Language" desc="Choose your preferred language for the app." />
      <div className="grid gap-2 sm:grid-cols-2">
        {LANGS.map((l) => {
          const active = lang === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                "flex items-center justify-between rounded-2xl border p-4 text-left transition-transform hover:scale-[1.01]",
                active ? "border-primary bg-primary/10" : "border-border bg-card",
              )}
            >
              <div>
                <p className="text-sm font-black">{l.label}</p>
                <p className="text-xs text-muted-foreground">{l.native}</p>
              </div>
              {active && (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
