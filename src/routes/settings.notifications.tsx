import { createFileRoute } from "@tanstack/react-router";
import { SettingsHeader, Toggle } from "@/components/SettingsBits";

export const Route = createFileRoute("/settings/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Settings" }, { name: "description", content: "Manage notification preferences." }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <div>
      <SettingsHeader title="Notifications" desc="Choose what you want to hear from us." />
      <div className="space-y-2">
        <Toggle label="Order status updates" storageKey="kk_notif_order" defaultOn />
        <Toggle label="New menu & offers" storageKey="kk_notif_offers" defaultOn />
        <Toggle label="Weekly digest email" storageKey="kk_notif_digest" />
        <Toggle label="Promotional SMS" storageKey="kk_notif_promo_sms" />
      </div>
    </div>
  );
}
