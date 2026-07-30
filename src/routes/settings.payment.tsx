import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, CreditCard, Smartphone, Trash2 } from "lucide-react";
import { SettingsHeader, Card, Field, TextInput, PrimaryButton, GhostButton, useLocal } from "@/components/SettingsBits";
import SpecularButton from "@/components/SpecularButton";

export const Route = createFileRoute("/settings/payment")({
  head: () => ({ meta: [{ title: "Payment Methods — Settings" }, { name: "description", content: "Manage saved cards and UPI." }] }),
  component: PaymentPage,
});

type Method =
  | { id: string; type: "card"; label: string; last4: string; brand: string }
  | { id: string; type: "upi"; label: string; upi: string };

const seed: Method[] = [
  { id: "m1", type: "card", label: "Personal Visa", last4: "4242", brand: "VISA" },
  { id: "m2", type: "upi", label: "GPay", upi: "kabir@okhdfc" },
];

function PaymentPage() {
  const [list, setList] = useLocal<Method[]>("kk_payments", seed);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<"card" | "upi">("card");
  const [cardName, setCardName] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [upiLabel, setUpiLabel] = useState("");
  const [upiId, setUpiId] = useState("");

  const save = () => {
    if (kind === "card") {
      if (!cardName || cardNo.length < 4) return;
      const last4 = cardNo.replace(/\s/g, "").slice(-4);
      setList([...list, { id: `m${Date.now()}`, type: "card", label: cardName, last4, brand: "CARD" }]);
      setCardName(""); setCardNo("");
    } else {
      if (!upiLabel || !upiId.includes("@")) return;
      setList([...list, { id: `m${Date.now()}`, type: "upi", label: upiLabel, upi: upiId }]);
      setUpiLabel(""); setUpiId("");
    }
    setOpen(false);
  };

  return (
    <div>
      <SettingsHeader title="Payment Methods" desc="Saved cards and UPI IDs (demo — nothing is charged)." />
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((m) => (
          <Card key={m.id}>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                {m.type === "card" ? <CreditCard className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black">{m.label}</p>
                <p className="mt-0.5 font-mono text-sm text-muted-foreground">
                  {m.type === "card" ? `${m.brand} •••• ${m.last4}` : m.upi}
                </p>
              </div>
              <SpecularButton
                onClick={() => setList(list.filter((x) => x.id !== m.id))}
                aria-label="Remove"
                className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary"
              >
                <Trash2 className="h-4 w-4" />
              </SpecularButton>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-5">
        {!open ? (
          <PrimaryButton onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add payment method
          </PrimaryButton>
        ) : (
          <Card className="mt-2">
            <div className="mb-4 flex gap-2">
              {(["card", "upi"] as const).map((k) => (
                <SpecularButton
                  key={k}
                  onClick={() => setKind(k)}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${kind === k ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                >
                  {k === "card" ? "Card" : "UPI"}
                </SpecularButton>
              ))}
            </div>

            {kind === "card" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name on card"><TextInput value={cardName} onChange={(e) => setCardName(e.target.value)} /></Field>
                <Field label="Card number"><TextInput value={cardNo} onChange={(e) => setCardNo(e.target.value)} placeholder="•••• •••• •••• 1234" /></Field>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Label"><TextInput value={upiLabel} onChange={(e) => setUpiLabel(e.target.value)} placeholder="GPay" /></Field>
                <Field label="UPI ID"><TextInput value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@bank" /></Field>
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <PrimaryButton onClick={save}>Save</PrimaryButton>
              <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
