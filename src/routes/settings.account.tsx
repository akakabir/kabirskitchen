import { createFileRoute } from "@tanstack/react-router";
import { LogOut, User as UserIcon } from "lucide-react";
import { SettingsHeader, Card, Field, TextInput, PrimaryButton, GhostButton, useLocal } from "@/components/SettingsBits";

export const Route = createFileRoute("/settings/account")({
  head: () => ({ meta: [{ title: "Account — Settings" }, { name: "description", content: "Manage your profile info." }] }),
  component: AccountPage,
});

interface Profile { name: string; email: string; phone: string; }

function AccountPage() {
  const [profile, setProfile] = useLocal<Profile>("kk_profile", {
    name: "Kabir",
    email: "hello@kabirskitchen.in",
    phone: "+91 98765 43210",
  });

  return (
    <div>
      <SettingsHeader title="Account" desc="Your profile and login details." />
      <Card>
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary text-muted-foreground">
            <UserIcon className="h-9 w-9" />
          </div>
          <div>
            <p className="text-base font-black">{profile.name || "Your name"}</p>
            <p className="text-xs text-muted-foreground">Profile photo placeholder</p>
            <GhostButton className="mt-2 !py-1.5 !px-3 text-xs" onClick={() => alert("Photo upload is a demo placeholder.")}>Upload photo</GhostButton>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <TextInput value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <TextInput value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </Field>
          <Field label="Phone number">
            <TextInput value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <p className="text-xs text-muted-foreground">Changes save automatically to this device.</p>
          <PrimaryButton onClick={() => alert("Logged out (demo).")}>
            <LogOut className="h-4 w-4" /> Log out
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}
