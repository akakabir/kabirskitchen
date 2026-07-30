import { useEffect, useState, type ReactNode } from "react";
import SpecularButton from "@/components/SpecularButton";

export function SettingsHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black">{title}</h2>
      {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card p-5 ${className}`}>{children}</div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-full border border-border bg-secondary px-4 py-2 text-sm outline-none focus:border-primary ${props.className ?? ""}`}
    />
  );
}

export function Toggle({ label, storageKey, defaultOn = false }: { label: string; storageKey: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  useEffect(() => {
    try {
      const v = localStorage.getItem(storageKey);
      if (v !== null) setOn(v === "1");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggle = () => {
    setOn((v) => {
      const nv = !v;
      try { localStorage.setItem(storageKey, nv ? "1" : "0"); } catch {}
      return nv;
    });
  };
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-4">
      <span className="text-sm font-bold">{label}</span>
      <input type="checkbox" checked={on} onChange={toggle} className="peer sr-only" />
      <span className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary" : "bg-secondary"}`}>
        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </span>
    </label>
  );
}

export function PrimaryButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <SpecularButton
      {...rest}
      className={`inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground shadow transition-transform hover:scale-[1.03] active:scale-95 ${rest.className ?? ""}`}
    >
      {children}
    </SpecularButton>
  );
}

export function GhostButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <SpecularButton
      {...rest}
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2.5 text-sm font-bold hover:border-primary hover:text-primary ${rest.className ?? ""}`}
    >
      {children}
    </SpecularButton>
  );
}

export function useLocal<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setState(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const set = (v: T | ((p: T) => T)) => {
    setState((prev) => {
      const nv = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(nv)); } catch {}
      return nv;
    });
  };
  return [state, set];
}
