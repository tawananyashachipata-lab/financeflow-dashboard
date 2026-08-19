import { Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { expenseCategories, incomeCategories, type Category, type TxType } from "@/lib/finance-data";
import { useFinance } from "@/lib/finance-store";
import { cn } from "@/lib/utils";

export function AddTransactionDialog({ trigger }: { trigger?: ReactNode }) {
  const { addTransaction } = useFinance();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState<TxType>("expense");
  const [title, setTitle] = useState("");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const categories = type === "income" ? incomeCategories : expenseCategories;

  const reset = () => {
    setType("expense");
    setTitle("");
    setMerchant("");
    setAmount("");
    setCategory("Food");
    setDate(new Date().toISOString().slice(0, 10));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!title.trim() || !Number.isFinite(value) || value <= 0) {
      toast.error("Add a description and an amount greater than zero.");
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      addTransaction({
        title: title.trim(),
        merchant: merchant.trim() || title.trim(),
        category,
        type,
        amount: value,
        date,
      });
      setSaving(false);
      setOpen(false);
      reset();
      toast.success(`${type === "income" ? "Income" : "Expense"} added successfully`);
    }, 450);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" /> Add transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
          <DialogDescription>
            Record money coming in or going out. Everything stays on this device.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-secondary/60 p-1">
            {(["expense", "income"] as TxType[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setType(option);
                  setCategory(option === "income" ? "Salary" : "Food");
                }}
                aria-pressed={type === option}
                className={cn(
                  "rounded-md py-2 text-sm font-medium capitalize transition-colors",
                  type === option
                    ? option === "income"
                      ? "bg-success text-success-foreground"
                      : "bg-expense text-destructive-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-title">Description</Label>
            <Input
              id="tx-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Grocery run"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tx-amount">Amount</Label>
              <Input
                id="tx-amount"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-date">Date</Label>
              <Input
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger id="tx-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-merchant">Merchant (optional)</Label>
            <Input
              id="tx-merchant"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="Fresh Market"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={saving}>
              {saving ? "Saving…" : "Save transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
