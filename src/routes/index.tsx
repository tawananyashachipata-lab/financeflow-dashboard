import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  PiggyBank,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { AddTransactionDialog } from "@/components/finance/AddTransactionDialog";
import { EmptyState } from "@/components/finance/EmptyState";
import { PageHeader } from "@/components/finance/PageHeader";
import { StatCard } from "@/components/finance/StatCard";
import { TransactionList } from "@/components/finance/TransactionList";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { categoryColors } from "@/lib/finance-data";
import { useFinance, useMonthlyStats } from "@/lib/finance-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FinanceFlow" },
      {
        name: "description",
        content:
          "See your balance, monthly income, expenses, budgets and savings goals at a glance.",
      },
      { property: "og:title", content: "Dashboard — FinanceFlow" },
      {
        property: "og:description",
        content: "Your money overview: balance, budgets, spending and savings goals.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { settings, formatMoney, goals, transactions } = useFinance();
  const stats = useMonthlyStats();

  const pieData = Object.entries(stats.spentByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const budgetPct = stats.budgetTotal
    ? Math.min(100, (stats.budgetSpent / stats.budgetTotal) * 100)
    : 0;

  const topGoals = [...goals].sort((a, b) => b.saved / b.target - a.saved / a.target).slice(0, 3);
  const firstName = settings.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        description="Here's how your money is doing this month."
        actions={
          <>
            <AddTransactionDialog />
            <Button variant="outline" asChild>
              <Link to="/analytics">
                View analytics <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total balance"
          value={formatMoney(stats.balance)}
          icon={Wallet}
          delta={4.2}
          hint="vs last month"
        />
        <StatCard
          label="Monthly income"
          value={formatMoney(stats.income)}
          icon={TrendingUp}
          tone="success"
          delta={6.8}
        />
        <StatCard
          label="Monthly expenses"
          value={formatMoney(stats.expenses)}
          icon={TrendingDown}
          tone="expense"
          delta={-3.1}
        />
        <StatCard
          label="Saved this month"
          value={formatMoney(Math.max(0, stats.savedThisMonth))}
          icon={PiggyBank}
          tone="success"
          hint="income minus expenses"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Budget progress</h2>
              <p className="text-sm text-muted-foreground">
                {formatMoney(stats.budgetSpent)} of {formatMoney(stats.budgetTotal)} used
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/budget">Manage</Link>
            </Button>
          </div>
          <Progress value={budgetPct} className="mt-4 h-3" />
          <p className="mt-2 text-sm text-muted-foreground">
            {formatMoney(Math.max(0, stats.budgetTotal - stats.budgetSpent))} left across all
            categories · {budgetPct.toFixed(0)}% used
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <AddTransactionDialog
              trigger={
                <Button variant="success" size="sm">
                  <Plus className="h-4 w-4" /> Quick add
                </Button>
              }
            />
            <Button variant="soft" size="sm" asChild>
              <Link to="/goals">
                <Target className="h-4 w-4" /> Add to a goal
              </Link>
            </Button>
            <Button variant="soft" size="sm" asChild>
              <Link to="/transactions">All transactions</Link>
            </Button>
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-base font-semibold">Spending by category</h2>
          {pieData.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No expenses recorded this month yet.
            </p>
          ) : (
            <>
              <div className="mt-2 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {pieData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={categoryColors[entry.name] ?? "var(--chart-2)"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatMoney(value)}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-3 space-y-2">
                {pieData.slice(0, 5).map((slice) => (
                  <li key={slice.name} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: categoryColors[slice.name] }}
                    />
                    <span className="flex-1 text-muted-foreground">{slice.name}</span>
                    <span className="font-medium tabular-nums">
                      {formatMoney(slice.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent transactions</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/transactions">See all</Link>
            </Button>
          </div>
          <div className="mt-2">
            {transactions.length === 0 ? (
              <EmptyState
                icon={Wallet}
                title="No transactions yet"
                description="Add your first income or expense to start tracking."
                action={<AddTransactionDialog />}
              />
            ) : (
              <TransactionList transactions={transactions.slice(0, 6)} />
            )}
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Savings goals</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/goals">Open</Link>
            </Button>
          </div>
          <ul className="mt-4 space-y-4">
            {topGoals.map((goal) => {
              const pct = Math.min(100, (goal.saved / goal.target) * 100);
              return (
                <li key={goal.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {goal.emoji} {goal.name}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={pct} className="mt-2 h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatMoney(goal.saved)} of {formatMoney(goal.target)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
