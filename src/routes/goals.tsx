import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Plus, Target } from "lucide-react";
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
import { useFinance } from "@/lib/finance-store";

export const Route = createFileRoute("/goals")({
  head: () => ({
    meta: [
      { title: "Savings Goals — FinanceFlow" },
      {
        name: "description",
        content:
          "Track savings goals like a new laptop, emergency fund or vacation with clear progress.",
      },
      { property: "og:title", content: "Savings Goals — FinanceFlow" },
      {
        property: "og:description",
        content: "Visual progress for every savings goal you're working toward.",
      },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  const { goals, contributeToGoal, addGoal, formatMoney } = useFinance();
  const [contributeId, setContributeId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", target: "", deadline: "", emoji: "🎯" });

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const activeGoal = goals.find((g) => g.id === contributeId);

  const submitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!activeGoal || !Number.isFinite(value) || value <= 0) {
      toast.error("Enter an amount greater than zero.");
      return;
    }
    contributeToGoal(activeGoal.id, value);
    setContributeId(null);
    setAmount("");
    toast.success(`${formatMoney(value)} added to ${activeGoal.name}`);
  };

  const submitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(draft.target);
    if (!draft.name.trim() || !Number.isFinite(target) || target <= 0) {
      toast.error("Add a goal name and a target amount.");
      return;
    }
    addGoal({
      name: draft.name.trim(),
      target,
      saved: 0,
      deadline: draft.deadline || "2027-12-31",
      emoji: draft.emoji || "🎯",
    });
    setNewOpen(false);
    setDraft({ name: "", target: "", deadline: "", emoji: "🎯" });
    toast.success("Savings goal created");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Savings goals"
        description="Small consistent deposits turn into big wins."
        actions={
          <Button onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4" /> New goal
          </Button>
        }
      />

      <div className="card-surface p-5">
        <p className="text-sm text-muted-foreground">Total saved across all goals</p>
        <p className="mt-1 text-3xl font-semibold text-success tabular-nums">
          {formatMoney(totalSaved)}
        </p>
        <Progress
          value={totalTarget ? (totalSaved / totalTarget) * 100 : 0}
          className="mt-4 h-3"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {formatMoney(Math.max(0, totalTarget - totalSaved))} left to reach{" "}
          {formatMoney(totalTarget)} across {goals.length} goals
        </p>
      </div>

      {goals.length === 0 ? (
        <div className="card-surface p-5">
          <EmptyState
            icon={Target}
            title="No savings goals yet"
            description="Create a goal to give your saving a clear finish line."
            action={<Button onClick={() => setNewOpen(true)}>Create a goal</Button>}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => {
            const pct = Math.min(100, (goal.saved / goal.target) * 100);
            const complete = goal.saved >= goal.target;
            return (
              <div key={goal.id} className="card-surface flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-xl">
                      {goal.emoji}
                    </span>
                    <div>
                      <h2 className="text-base font-semibold">{goal.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        Target date{" "}
                        {new Date(goal.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {complete && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Reached
                    </span>
                  )}
                </div>

                <Progress value={pct} className="mt-5 h-2.5" />

                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Saved</p>
                    <p className="font-semibold text-success tabular-nums">
                      {formatMoney(goal.saved)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-semibold tabular-nums">{formatMoney(goal.target)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="font-semibold tabular-nums">
                      {formatMoney(Math.max(0, goal.target - goal.saved))}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-muted-foreground tabular-nums">
                    {pct.toFixed(0)}% complete
                  </span>
                  <Button
                    variant={complete ? "soft" : "success"}
                    size="sm"
                    disabled={complete}
                    onClick={() => {
                      setContributeId(goal.id);
                      setAmount("");
                    }}
                  >
                    {complete ? "Goal reached" : "Add funds"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={contributeId !== null} onOpenChange={(o) => !o && setContributeId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add funds to {activeGoal?.name}</DialogTitle>
            <DialogDescription>
              {activeGoal &&
                `${formatMoney(Math.max(0, activeGoal.target - activeGoal.saved))} left to reach this goal.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitContribution} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-amount">Amount</Label>
              <Input
                id="goal-amount"
                type="number"
                min="1"
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContributeId(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Add funds
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New savings goal</DialogTitle>
            <DialogDescription>Name it, set a target, start saving.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitGoal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal name</Label>
              <Input
                id="goal-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Road trip"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target amount</Label>
                <Input
                  id="goal-target"
                  type="number"
                  min="1"
                  value={draft.target}
                  onChange={(e) => setDraft({ ...draft, target: e.target.value })}
                  placeholder="1500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-date">Target date</Label>
                <Input
                  id="goal-date"
                  type="date"
                  value={draft.deadline}
                  onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-emoji">Icon</Label>
              <Input
                id="goal-emoji"
                maxLength={2}
                value={draft.emoji}
                onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
                className="w-20 text-center"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Create goal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
