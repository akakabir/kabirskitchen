import { createFileRoute } from "@tanstack/react-router";
import { Download, Trash2 } from "lucide-react";
import { SettingsHeader, Toggle, Card, PrimaryButton, GhostButton } from "@/components/SettingsBits";
import { useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/settings/privacy")({
  head: () => ({ meta: [{ title: "Privacy & Data — Settings" }, { name: "description", content: "Control your privacy and data." }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { clear } = useCart();

  const download = () => {
    const dump = {
      exportedAt: new Date().toISOString(),
      profile: safeParse(localStorage.getItem("kk_profile")),
      addresses: safeParse(localStorage.getItem("kk_addresses")),
      payments: safeParse(localStorage.getItem("kk_payments")),
      language: localStorage.getItem("kk_language"),
      theme: localStorage.getItem("kk_theme"),
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "kabirs-kitchen-data.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <SettingsHeader title="Privacy & Data" desc="You control what stays on this device." />
      <div className="space-y-2">
        <Toggle label="Share order history for recommendations" storageKey="kk_priv_recs" defaultOn />
        <Toggle label="Anonymous usage analytics" storageKey="kk_priv_analytics" defaultOn />
        <Toggle label="Personalised marketing emails" storageKey="kk_priv_marketing" />
      </div>

      <Card className="mt-6">
        <p className="text-sm font-black">Your data</p>
        <p className="mt-1 text-sm text-muted-foreground">Export or clear the data this app keeps locally.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <PrimaryButton onClick={download}>
            <Download className="h-4 w-4" /> Download my data
          </PrimaryButton>
          <GhostButton onClick={() => { clear(); alert("Cart data cleared."); }}>
            <Trash2 className="h-4 w-4" /> Clear cart data
          </GhostButton>
        </div>
      </Card>
    </div>
  );
}

function safeParse(v: string | null) {
  if (!v) return null;
  try { return JSON.parse(v); } catch { return v; }
}
