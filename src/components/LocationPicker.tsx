import { useEffect, useMemo, useRef, useState } from "react";
import { X, Search, LocateFixed, MapPin, Loader2, Home, Briefcase, Star } from "lucide-react";
import {
import SpecularButton from "@/components/SpecularButton";
  useLocation,
  searchAddress,
  reverseGeocode,
  shortLabel,
  type NominatimResult,
  type SavedAddress,
} from "@/lib/location-context";

type LabelKind = "Home" | "Work" | "Other";

interface Draft {
  lat: number;
  lng: number;
  formatted: string;
  fullAddress: string;
  pincode: string;
  house: string;
  building: string;
  landmark: string;
  instructions: string;
  label: LabelKind;
}

const DEFAULT_CENTER = { lat: 19.076, lng: 72.8777 }; // Mumbai

export function LocationPicker() {
  const { pickerOpen, closePicker, addAddress, updateAddress, editingId, addresses } = useLocation();
  if (!pickerOpen) return null;
  return (
    <PickerInner
      onClose={closePicker}
      onSave={(d) => {
        const payload = {
          label: d.label,
          formatted: d.formatted,
          fullAddress: d.fullAddress,
          lat: d.lat,
          lng: d.lng,
          house: d.house,
          building: d.building,
          landmark: d.landmark,
          instructions: d.instructions,
          pincode: d.pincode,
        };
        if (editingId) updateAddress(editingId, payload);
        else addAddress(payload);
        closePicker();
      }}
      initial={editingId ? addresses.find((a) => a.id === editingId) ?? null : null}
    />
  );
}

function PickerInner({
  onClose,
  onSave,
  initial,
}: {
  onClose: () => void;
  onSave: (d: Draft) => void;
  initial: SavedAddress | null;
}) {
  const [draft, setDraft] = useState<Draft>(() => ({
    lat: initial?.lat ?? DEFAULT_CENTER.lat,
    lng: initial?.lng ?? DEFAULT_CENTER.lng,
    formatted: initial?.formatted ?? "",
    fullAddress: initial?.fullAddress ?? "",
    pincode: initial?.pincode ?? "",
    house: initial?.house ?? "",
    building: initial?.building ?? "",
    landmark: initial?.landmark ?? "",
    instructions: initial?.instructions ?? "",
    label: (initial?.label as LabelKind) ?? "Home",
  }));

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [reversing, setReversing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setPoint = async (lat: number, lng: number) => {
    setDraft((d) => ({ ...d, lat, lng }));
    setReversing(true);
    try {
      const r = await reverseGeocode(lat, lng);
      if (r) {
        setDraft((d) => ({
          ...d,
          formatted: shortLabel(r),
          fullAddress: r.display_name,
          pincode: r.address?.postcode ?? d.pincode,
        }));
      }
    } catch {}
    setReversing(false);
  };

  // Debounced Nominatim search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const list = await searchAddress(query, ctrl.signal);
        setResults(list);
      } catch {}
      setSearching(false);
    }, 450);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [query]);

  const chooseResult = (r: NominatimResult) => {
    const lat = parseFloat(r.lat), lng = parseFloat(r.lon);
    setDraft((d) => ({
      ...d,
      lat, lng,
      formatted: shortLabel(r),
      fullAddress: r.display_name,
      pincode: r.address?.postcode ?? d.pincode,
    }));
    setQuery("");
    setResults([]);
  };

  const useCurrent = () => {
    if (!navigator.geolocation) { setError("Geolocation unavailable"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => { await setPoint(pos.coords.latitude, pos.coords.longitude); setLocating(false); },
      (err) => { setError(err.message || "Couldn't get your location"); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const canSave = draft.formatted.trim() && draft.house.trim();

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-none bg-background shadow-2xl sm:my-auto sm:max-h-[92vh] sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-black">{initial ? "Edit address" : "Set your delivery location"}</h2>
            <p className="text-xs text-muted-foreground">Powered by OpenStreetMap · free & keyless</p>
          </div>
          <SpecularButton onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
            <X className="h-5 w-5" />
          </SpecularButton>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="relative px-5 pt-4">
            <Search className="pointer-events-none absolute left-8 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for area, street, landmark…"
              className="w-full rounded-full border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {(results.length > 0 || searching) && (
              <div className="absolute left-5 right-5 z-20 mt-1 max-h-64 overflow-y-auto rounded-2xl border border-border bg-popover shadow-xl">
                {searching && (
                  <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching…
                  </div>
                )}
                {results.map((r) => (
                  <SpecularButton
                    key={r.place_id}
                    onClick={() => chooseResult(r)}
                    className="flex w-full items-start gap-2 border-t border-border/50 px-4 py-2.5 text-left text-sm first:border-t-0 hover:bg-secondary"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="line-clamp-2">{r.display_name}</span>
                  </SpecularButton>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 pt-3">
            <SpecularButton
              onClick={useCurrent}
              disabled={locating}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-bold hover:border-primary hover:text-primary disabled:opacity-60"
            >
              {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="h-3.5 w-3.5" />}
              Use my current location
            </SpecularButton>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          </div>

          {/* Map */}
          <div className="px-5 pt-4">
            <LeafletMap
              lat={draft.lat}
              lng={draft.lng}
              onChange={(lat, lng) => setPoint(lat, lng)}
            />
            <div className="mt-2 flex items-start gap-2 rounded-2xl bg-secondary/60 p-3 text-xs">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{draft.formatted || "Drag the pin to set your delivery spot"}</p>
                {draft.fullAddress && <p className="mt-0.5 text-muted-foreground line-clamp-2">{draft.fullAddress}</p>}
              </div>
              {reversing && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
            <Field label="House / Flat no. & Floor *">
              <Text v={draft.house} on={(v) => setDraft((d) => ({ ...d, house: v }))} placeholder="Flat 402, 3rd floor" />
            </Field>
            <Field label="Building / Society name">
              <Text v={draft.building} on={(v) => setDraft((d) => ({ ...d, building: v }))} placeholder="Sunshine Apts" />
            </Field>
            <Field label="Landmark (optional)">
              <Text v={draft.landmark} on={(v) => setDraft((d) => ({ ...d, landmark: v }))} placeholder="Opp. HDFC ATM" />
            </Field>
            <Field label="Pincode">
              <Text v={draft.pincode} on={(v) => setDraft((d) => ({ ...d, pincode: v }))} placeholder="400050" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Delivery instructions for the driver">
                <textarea
                  rows={2}
                  value={draft.instructions}
                  onChange={(e) => setDraft((d) => ({ ...d, instructions: e.target.value }))}
                  placeholder="Ring the bell twice · Leave at the door · Call on arrival"
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-black uppercase tracking-wider text-muted-foreground">
                Save as
              </label>
              <div className="flex flex-wrap gap-2">
                {(["Home", "Work", "Other"] as LabelKind[]).map((k) => {
                  const Icon = k === "Home" ? Home : k === "Work" ? Briefcase : Star;
                  const active = draft.label === k;
                  return (
                    <SpecularButton
                      key={k}
                      onClick={() => setDraft((d) => ({ ...d, label: k }))}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary hover:border-primary"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" /> {k}
                    </SpecularButton>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border bg-card px-5 py-3">
          <SpecularButton onClick={onClose} className="rounded-full border border-border bg-secondary px-5 py-2 text-sm font-bold hover:border-primary">
            Cancel
          </SpecularButton>
          <SpecularButton
            onClick={() => canSave && onSave(draft)}
            disabled={!canSave}
            className="rounded-full bg-primary px-5 py-2 text-sm font-black text-primary-foreground shadow transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {initial ? "Save changes" : "Save & use this address"}
          </SpecularButton>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
function Text({ v, on, placeholder }: { v: string; on: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={v}
      onChange={(e) => on(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-full border border-border bg-secondary px-4 py-2 text-sm outline-none focus:border-primary"
    />
  );
}

/** Client-only Leaflet map with a draggable marker. */
function LeafletMap({
  lat, lng, onChange,
}: { lat: number; lng: number; onChange: (lat: number, lng: number) => void }) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !elRef.current || mapRef.current) return;

      // Fix default marker icons (bundler strips images otherwise)
      const iconRetina = (await import("leaflet/dist/images/marker-icon-2x.png")).default;
      const icon = (await import("leaflet/dist/images/marker-icon.png")).default;
      const shadow = (await import("leaflet/dist/images/marker-shadow.png")).default;
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: iconRetina, iconUrl: icon, shadowUrl: shadow });

      const map = L.map(elRef.current, { zoomControl: true }).setView([lat, lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        onChangeRef.current(p.lat, p.lng);
      });
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        onChangeRef.current(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;

      // Force a resize once mounted inside the modal
      setTimeout(() => map.invalidateSize(), 60);
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markerRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external lat/lng changes (search / current location) to map + marker
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([lat, lng]);
    mapRef.current.setView([lat, lng], Math.max(mapRef.current.getZoom(), 15));
  }, [lat, lng]);

  return <div ref={elRef} className="h-64 w-full overflow-hidden rounded-2xl border border-border sm:h-72" />;
}
