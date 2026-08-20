import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/finance/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { currencies } from "@/lib/finance-data";
import { useFinance } from "@/lib/finance-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — FinanceFlow" },
      {
        name: "description",
        content: "Update your profile, currency, notification preferences and appearance.",
      },
      { property: "og:title", content: "Settings — FinanceFlow" },
      {
        property: "og:description",
        content: "Profile, currency, notifications and appearance preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-surface p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <div>
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function SettingsPage() {
  const { settings, updateSettings } = useFinance();
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [saving, setSaving] = useState(false);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      updateSettings({ name, email });
      setSaving(false);
      toast.success("Profile updated");
    }, 400);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Personalise how FinanceFlow works for you." />

      <Section title="Profile" description="Your name and contact details.">
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" variant="success" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Section>

      <Section title="Currency" description="Used across all amounts in the app.">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="currency">Preferred currency</Label>
          <Select
            value={settings.currency}
            onValueChange={(v) => {
              updateSettings({ currency: v });
              toast.success(`Currency switched to ${v}`);
            }}
          >
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.code} — {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="Notifications" description="Choose what you want to be reminded about.">
        <ToggleRow
          id="notify-budget"
          label="Budget alerts"
          hint="Get notified when a category reaches 80% of its limit."
          checked={settings.notifyBudgetAlerts}
          onChange={(v) => updateSettings({ notifyBudgetAlerts: v })}
        />
        <ToggleRow
          id="notify-goals"
          label="Goal milestones"
          hint="Celebrate every 25% of progress on a savings goal."
          checked={settings.notifyGoalMilestones}
          onChange={(v) => updateSettings({ notifyGoalMilestones: v })}
        />
        <ToggleRow
          id="notify-digest"
          label="Weekly digest"
          hint="A short summary of your spending every Monday."
          checked={settings.notifyWeeklyDigest}
          onChange={(v) => updateSettings({ notifyWeeklyDigest: v })}
        />
      </Section>

      <Section title="Appearance" description="Fine-tune the look of your dashboard.">
        <div className="space-y-2">
          <Label>Layout density</Label>
          <div className="grid max-w-sm grid-cols-2 gap-1 rounded-lg bg-secondary/60 p-1">
            {(["comfortable", "compact"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={settings.density === option}
                onClick={() => updateSettings({ density: option })}
                className={cn(
                  "rounded-md py-2 text-sm font-medium capitalize transition-colors",
                  settings.density === option
                    ? "bg-card text-foreground shadow-[var(--shadow-card)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <ToggleRow
          id="accent-bars"
          label="Colour-coded progress bars"
          hint="Use green, amber and red to signal budget health."
          checked={settings.accentBars}
          onChange={(v) => updateSettings({ accentBars: v })}
        />
      </Section>
    </div>
  );
}
