import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin, Trash2, Pencil, Check, Home as HomeIcon, Briefcase, Star } from "lucide-react";
import { SettingsHeader, Card, PrimaryButton } from "@/components/SettingsBits";
import { useLocation, type SavedAddress } from "@/lib/location-context";

export const Route = createFileRoute("/settings/addresses")({
  head: () => ({ meta: [{ title: "Saved Addresses — Settings" }, { name: "description", content: "Manage your delivery addresses." }] }),
  component: AddressesPage,
});

function labelIcon(label: string) {
  if (label === "Home") return HomeIcon;
  if (label === "Work") return Briefcase;
  return Star;
}

function AddressesPage() {
  const { addresses, removeAddress, openPicker, selectedId, setSelectedId } = useLocation();

  return (
    <div>
      <SettingsHeader title="Saved Addresses" desc="Deliver to the same spots faster. Pick a default so the app opens with it selected." />
      <div className="space-y-3">
        {addresses.map((a: SavedAddress) => {
          const Icon = labelIcon(a.label);
          const isDefault = a.id === selectedId;
          return (
            <Card key={a.id} className={isDefault ? "border-primary/60 ring-2 ring-primary/20" : ""}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black">{a.label}</p>
                    {isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                        <Check className="h-3 w-3" /> Default
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm">
                    <b>{a.house}</b>
                    {a.building ? `, ${a.building}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">{a.fullAddress || a.formatted}</p>
                  {a.landmark && <p className="text-xs text-muted-foreground">Landmark: {a.landmark}</p>}
                  {a.instructions && <p className="mt-1 text-xs italic text-muted-foreground">Driver note: "{a.instructions}"</p>}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {!isDefault && (
                      <button
                        onClick={() => setSelectedId(a.id)}
                        className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold hover:border-primary hover:text-primary"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      onClick={() => openPicker(a.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold hover:border-primary hover:text-primary"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeAddress(a.id)}
                  aria-label="Remove"
                  className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          );
        })}
        {addresses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            <MapPin className="mx-auto mb-2 h-6 w-6 text-primary" />
            No saved addresses yet. Add one to get started.
          </div>
        )}
      </div>

      <div className="mt-5">
        <PrimaryButton onClick={() => openPicker()}>
          <Plus className="h-4 w-4" /> Add new address
        </PrimaryButton>
      </div>
    </div>
  );
}
