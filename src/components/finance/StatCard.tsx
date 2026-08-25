import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "expense" | "warning";

const toneStyles: Record<Tone, { icon: string; value: string }> = {
  neutral: { icon: "bg-secondary text-primary", value: "text-foreground" },
  success: { icon: "bg-success-soft text-success", value: "text-success" },
  expense: { icon: "bg-expense-soft text-expense", value: "text-expense" },
  warning: { icon: "bg-warning-soft text-warning", value: "text-foreground" },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  delta,
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: Tone;
  delta?: number;
  hint?: string;
}) {
  const styles = toneStyles[tone];
  const DeltaIcon = (delta ?? 0) >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="card-surface p-5 transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("rounded-lg p-2", styles.icon)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className={cn("mt-3 text-2xl font-semibold tabular-nums sm:text-3xl", styles.value)}>
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-medium",
              delta >= 0 ? "bg-success-soft text-success" : "bg-expense-soft text-expense",
            )}
          >
            <DeltaIcon className="h-3 w-3" aria-hidden="true" />
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
