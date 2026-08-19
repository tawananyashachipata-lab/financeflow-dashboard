import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Pencil, Plus, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/finance/EmptyState";
import { PageHeader } from "@/components/finance/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { expenseCategories, type Category } from "@/lib/finance-data";
import { useFinance, useMonthlyStats } from "@/lib/finance-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/budget")({
  head: () => ({
    meta: [
      { title: "Budget — FinanceFlow" },
      {
        name: "description",
        content: "Set monthly category budgets and watch how much you have left to spend.",
      },
      { property: "og:title", content: "Budget — FinanceFlow" },
      {
        property: "og:description",
        content: "Monthly category budgets with spent vs remaining progress.",
      },
    ],
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const { budgets, upsertBudget, removeBudget, formatMoney } = useFinance();
  const stats = useMonthlyStats();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ category: Category; limit: string } | null>(null);

  const totalPct = stats.budgetTotal
    ? Math.min(100, (stats.budgetSpent / stats.budgetTotal) * 100)
    : 0;

  const openNew = () => {
    const unused = expenseCategories.find((c) => !budgets.some((b) => b.category === c));
    setEditing({ category: unused ?? "Food", limit: "" });
    setOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const limit = Number(editing.limit);
    if (!Number.isFinite(limit) || limit <= 0) {
      toast.error("Enter a budget amount greater than zero.");
      return;
    }
    upsertBudget(editing.category, limit);
    setOpen(false);
    toast.success(`${editing.category} budget set to ${formatMoney(limit)}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budget"
        description="Plan your month by category and stay ahead of overspending."
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Add budget
          </Button>
        }
      />

      <div className="card-surface p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Monthly budget overview</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {formatMoney(stats.budgetSpent)}
              <span className="text-base font-medium text-muted-foreground">
                {" "}
                / {formatMoney(stats.budgetTotal)}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-xl font-semibold text-success tabular-nums">
              {formatMoney(Math.max(0, stats.budgetTotal - stats.budgetSpent))}
            </p>
          </div>
        </div>
        <Progress value={totalPct} className="mt-4 h-3" />
        <p className="mt-2 text-sm text-muted-foreground">{totalPct.toFixed(0)}% of your total budget used</p>
      </div>

      {budgets.length === 0 ? (
        <div className="card-surface p-5">
          <EmptyState
            icon={Wallet}
            title="No budgets yet"
            description="Create a category budget to track spending against a monthly limit."
            action={<Button onClick={openNew}>Add your first budget</Button>}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => {
            const spent = stats.spentByCategory[budget.category] ?? 0;
            const pct = Math.min(100, (spent / budget.limit) * 100);
            const over = spent > budget.limit;
            const nearing = !over && pct >= 80;

            return (
              <div key={budget.id} className="card-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">{budget.category}</h2>
                    <p className="text-sm text-muted-foreground">
                      {formatMoney(spent)} spent of {formatMoney(budget.limit)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${budget.category} budget`}
                      onClick={() => {
                        setEditing({ category: budget.category, limit: String(budget.limit) });
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${budget.category} budget`}
                      className="hover:text-expense"
                      onClick={() => {
                        removeBudget(budget.id);
                        toast.success(`${budget.category} budget removed`);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Progress
                  value={pct}
                  className="mt-4 h-2.5"
                  indicatorClassName={
                    over ? "bg-expense" : nearing ? "bg-warning" : "bg-success"
                  }
                />

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span
                    className={cn(
                      "font-medium tabular-nums",
                      over ? "text-expense" : "text-success",
                    )}
                  >
                    {over
                      ? `${formatMoney(spent - budget.limit)} over`
                      : `${formatMoney(budget.limit - spent)} left`}
                  </span>
                  <span className="text-muted-foreground tabular-nums">{pct.toFixed(0)}%</span>
                </div>

                {(over || nearing) && (
                  <p
                    className={cn(
                      "mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
                      over ? "bg-expense-soft text-expense" : "bg-warning-soft text-foreground",
                    )}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                    {over
                      ? "You've gone over this budget."
                      : "You're close to your limit for this category."}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Set category budget</DialogTitle>
            <DialogDescription>
              Choose a category and the amount you want to cap each month.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget-category">Category</Label>
              <Select
                value={editing?.category ?? "Food"}
                onValueChange={(v) =>
                  setEditing((prev) => ({ limit: prev?.limit ?? "", category: v as Category }))
                }
              >
                <SelectTrigger id="budget-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-limit">Monthly limit</Label>
              <Input
                id="budget-limit"
                type="number"
                min="1"
                step="1"
                inputMode="decimal"
                value={editing?.limit ?? ""}
                onChange={(e) =>
                  setEditing((prev) => ({
                    category: prev?.category ?? "Food",
                    limit: e.target.value,
                  }))
                }
                placeholder="500"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Save budget
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
