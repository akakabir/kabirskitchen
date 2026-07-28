import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface SavedAddress {
  id: string;
  label: string;          // Home / Work / Other
  formatted: string;      // short display, e.g. "Bandra West, Mumbai"
  fullAddress: string;    // full nominatim display_name
  lat: number;
  lng: number;
  house: string;          // House/Flat number & Floor
  building: string;       // Building/Society name
  landmark: string;
  instructions: string;   // Driver instructions
  pincode: string;
}

interface Ctx {
  addresses: SavedAddress[];
  addAddress: (a: Omit<SavedAddress, "id">) => SavedAddress;
  updateAddress: (id: string, patch: Partial<SavedAddress>) => void;
  removeAddress: (id: string) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selected: SavedAddress | null;
  pickerOpen: boolean;
  editingId: string | null;
  openPicker: (editingId?: string | null) => void;
  closePicker: () => void;
}

const LocCtx = createContext<Ctx | null>(null);
const KEY = "kk_addresses";
const SEL_KEY = "kk_selected_address";

const SEED: SavedAddress[] = [
  {
    id: "a1", label: "Home",
    formatted: "Bandra West, Mumbai",
    fullAddress: "12, Sunshine Apts, Linking Road, Bandra West, Mumbai, Maharashtra 400050, India",
    lat: 19.0596, lng: 72.8295,
    house: "12, 3rd floor", building: "Sunshine Apts",
    landmark: "Opp. Linking Road McDonald's",
    instructions: "Ring the bell twice.",
    pincode: "400050",
  },
  {
    id: "a2", label: "Work",
    formatted: "BKC, Mumbai",
    fullAddress: "Prism Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India",
    lat: 19.0662, lng: 72.8683,
    house: "4th floor", building: "Prism Tower",
    landmark: "Near BKC signal",
    instructions: "Call on arrival, reception blocks lifts.",
    pincode: "400051",
  },
];

function migrate(raw: any): SavedAddress[] {
  if (!Array.isArray(raw)) return SEED;
  return raw.map((a: any, i: number) => ({
    id: String(a.id ?? `a${Date.now()}${i}`),
    label: a.label ?? "Home",
    formatted: a.formatted ?? a.address ?? "",
    fullAddress: a.fullAddress ?? a.address ?? "",
    lat: typeof a.lat === "number" ? a.lat : 19.076,
    lng: typeof a.lng === "number" ? a.lng : 72.8777,
    house: a.house ?? "",
    building: a.building ?? "",
    landmark: a.landmark ?? "",
    instructions: a.instructions ?? "",
    pincode: a.pincode ?? "",
  }));
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>(SEED);
  const [selectedId, setSelectedIdState] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const list = raw ? migrate(JSON.parse(raw)) : SEED;
      setAddresses(list);
      const sel = localStorage.getItem(SEL_KEY);
      setSelectedIdState(sel && list.some(a => a.id === sel) ? sel : (list[0]?.id ?? null));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(addresses)); } catch {}
  }, [addresses, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (selectedId) localStorage.setItem(SEL_KEY, selectedId);
      else localStorage.removeItem(SEL_KEY);
    } catch {}
  }, [selectedId, hydrated]);

  const addAddress: Ctx["addAddress"] = (a) => {
    const id = `a${Date.now()}`;
    const full: SavedAddress = { ...a, id };
    setAddresses((p) => [...p, full]);
    setSelectedIdState(id);
    return full;
  };

  const updateAddress: Ctx["updateAddress"] = (id, patch) => {
    setAddresses((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const removeAddress: Ctx["removeAddress"] = (id) => {
    setAddresses((p) => {
      const next = p.filter((x) => x.id !== id);
      if (selectedId === id) setSelectedIdState(next[0]?.id ?? null);
      return next;
    });
  };

  const selected = useMemo(
    () => addresses.find((a) => a.id === selectedId) ?? null,
    [addresses, selectedId],
  );

  return (
    <LocCtx.Provider
      value={{
        addresses, addAddress, updateAddress, removeAddress,
        selectedId, setSelectedId: setSelectedIdState, selected,
        pickerOpen, editingId,
        openPicker: (id = null) => { setEditingId(id); setPickerOpen(true); },
        closePicker: () => { setPickerOpen(false); setEditingId(null); },
      }}
    >
      {children}
    </LocCtx.Provider>
  );
}

export function useLocation() {
  const c = useContext(LocCtx);
  if (!c) throw new Error("useLocation must be used inside LocationProvider");
  return c;
}

// Nominatim helpers — free, no API key. Respect their usage policy.
const UA_REFERER = typeof window !== "undefined" ? window.location.origin : "";

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
}

export async function searchAddress(q: string, signal?: AbortSignal): Promise<NominatimResult[]> {
  if (!q.trim()) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6&addressdetails=1`;
  const res = await fetch(url, { signal, headers: { "Accept-Language": "en" } });
  if (!res.ok) return [];
  return (await res.json()) as NominatimResult[];
}

export async function reverseGeocode(lat: number, lng: number, signal?: AbortSignal): Promise<NominatimResult | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`;
  const res = await fetch(url, { signal, headers: { "Accept-Language": "en" } });
  if (!res.ok) return null;
  return (await res.json()) as NominatimResult;
}

export function shortLabel(r: { display_name?: string; address?: Record<string, string> }): string {
  const a = r.address ?? {};
  const locality = a.suburb || a.neighbourhood || a.village || a.town || a.city_district || a.hamlet || "";
  const city = a.city || a.town || a.village || a.state_district || "";
  if (locality && city && locality !== city) return `${locality}, ${city}`;
  if (locality) return locality;
  if (city) return city;
  return (r.display_name ?? "").split(",").slice(0, 2).join(", ");
}
