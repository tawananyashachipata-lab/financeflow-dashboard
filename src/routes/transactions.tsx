import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AddTransactionDialog } from "@/components/finance/AddTransactionDialog";
import { EmptyState } from "@/components/finance/EmptyState";
import { PageHeader } from "@/components/finance/PageHeader";
import { TransactionList } from "@/components/finance/TransactionList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { expenseCategories, incomeCategories } from "@/lib/finance-data";
import { useFinance } from "@/lib/finance-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — FinanceFlow" },
      {
        name: "description",
        content: "Search, filter and record every income and expense in one clean list.",
      },
      { property: "og:title", content: "Transactions — FinanceFlow" },
      {
        property: "og:description",
        content: "Every income and expense, searchable and filterable by category.",
      },
    ],
  }),
  component: TransactionsPage,
});

const allCategories = [...new Set([...expenseCategories, ...incomeCategories])];

function TransactionsPage() {
  const { transactions, deleteTransaction, formatMoney } = useFinance();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState<"all" | "income" | "expense">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions
      .filter((t) => (type === "all" ? true : t.type === type))
      .filter((t) => (category === "all" ? true : t.category === category))
      .filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [transactions, query, category, type]);

  const totals = useMemo(
    () => ({
      income: filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expense: filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    }),
    [filtered],
  );

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast.success("Transaction deleted");
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setType("all");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description={`${filtered.length} of ${transactions.length} transactions shown`}
        actions={<AddTransactionDialog />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-surface p-4">
          <p className="text-sm text-muted-foreground">Income in view</p>
          <p className="mt-1 text-xl font-semibold text-success tabular-nums">
            +{formatMoney(totals.income)}
          </p>
        </div>
        <div className="card-surface p-4">
          <p className="text-sm text-muted-foreground">Expenses in view</p>
          <p className="mt-1 text-xl font-semibold text-expense tabular-nums">
            −{formatMoney(totals.expense)}
          </p>
        </div>
      </div>

      <div className="card-surface p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search description, merchant or category"
              aria-label="Search transactions"
              className="pl-9"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="lg:w-52" aria-label="Filter by category">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {allCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div
            role="group"
            aria-label="Filter by type"
            className="grid grid-cols-3 gap-1 rounded-lg bg-secondary/60 p-1 lg:w-64"
          >
            {(["all", "income", "expense"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setType(option)}
                aria-pressed={type === option}
                className={cn(
                  "rounded-md py-2 text-sm font-medium capitalize transition-colors",
                  type === option
                    ? "bg-card text-foreground shadow-[var(--shadow-card)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-surface p-4 sm:p-5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No transactions match your filters"
            description="Try a different search term, or clear the filters to see everything again."
            action={
              <Button variant="outline" onClick={resetFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <TransactionList transactions={filtered} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
