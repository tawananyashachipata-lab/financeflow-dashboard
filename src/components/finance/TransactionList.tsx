import {
  Bus,
  CreditCard,
  Film,
  HeartPulse,
  ShoppingBag,
  Trash2,
  Utensils,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/finance-data";
import { useFinance } from "@/lib/finance-store";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  Food: Utensils,
  Transport: Bus,
  Shopping: ShoppingBag,
  Bills: CreditCard,
  Entertainment: Film,
  Health: HeartPulse,
  Salary: Wallet,
  Freelance: Wallet,
  Other: Wallet,
};

export function TransactionList({
  transactions,
  onDelete,
}: {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}) {
  const { formatMoney } = useFinance();

  return (
    <ul className="divide-y divide-border">
      {transactions.map((tx) => {
        const Icon = categoryIcons[tx.category] ?? Wallet;
        const income = tx.type === "income";
        return (
          <li
            key={tx.id}
            className="group flex items-center gap-3 px-1 py-3.5 transition-colors hover:bg-secondary/40 sm:gap-4 sm:px-2"
          >
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                income ? "bg-success-soft text-success" : "bg-secondary text-foreground",
              )}
            >
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{tx.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {tx.merchant} · {tx.category}
              </p>
            </div>

            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  income ? "text-success" : "text-expense",
                )}
              >
                {income ? "+" : "−"}
                {formatMoney(tx.amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(tx.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${tx.title}`}
                onClick={() => onDelete(tx.id)}
                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-expense"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
