import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MapPin, Trash2 } from "lucide-react";
import { SettingsHeader, Card, Field, TextInput, PrimaryButton, GhostButton, useLocal } from "@/components/SettingsBits";

export const Route = createFileRoute("/settings/addresses")({
  head: () => ({ meta: [{ title: "Saved Addresses — Settings" }, { name: "description", content: "Manage your delivery addresses." }] }),
  component: AddressesPage,
});

interface Address { id: string; label: string; address: string; pincode: string; }

const seed: Address[] = [
  { id: "a1", label: "Home", address: "12, Sunshine Apts, Linking Road, Bandra West", pincode: "400050" },
  { id: "a2", label: "Work", address: "4th floor, Prism Tower, BKC", pincode: "400051" },
];

function AddressesPage() {
  const [list, setList] = useLocal<Address[]>("kk_addresses", seed);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Address>({ id: "", label: "", address: "", pincode: "" });

  const save = () => {
    if (!draft.label.trim() || !draft.address.trim()) return;
    setList([...list, { ...draft, id: `a${Date.now()}` }]);
    setDraft({ id: "", label: "", address: "", pincode: "" });
    setOpen(false);
  };

  return (
    <div>
      <SettingsHeader title="Saved Addresses" desc="Deliver to the same spots faster." />
      <div className="space-y-3">
        {list.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black">{a.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{a.address}</p>
                <p className="text-xs text-muted-foreground">PIN {a.pincode || "—"}</p>
              </div>
              <button
                onClick={() => setList(list.filter((x) => x.id !== a.id))}
                aria-label="Remove"
                className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
        {list.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No saved addresses yet.</p>
        )}
      </div>

      <div className="mt-5">
        {!open ? (
          <PrimaryButton onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add new address
          </PrimaryButton>
        ) : (
          <Card className="mt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Label (Home, Work…)"><TextInput value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></Field>
              <Field label="Pincode"><TextInput value={draft.pincode} onChange={(e) => setDraft({ ...draft, pincode: e.target.value })} /></Field>
              <div className="sm:col-span-2">
                <Field label="Address"><TextInput value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} placeholder="Flat, building, street, area" /></Field>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <PrimaryButton onClick={save}>Save address</PrimaryButton>
              <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
