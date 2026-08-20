import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/finance/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryColors, monthlyHistory, savingsHistory } from "@/lib/finance-data";
import { useFinance, useMonthlyStats } from "@/lib/finance-store";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — FinanceFlow" },
      {
        name: "description",
        content:
          "Charts for income vs expenses, category spending, monthly trends and savings growth.",
      },
      { property: "og:title", content: "Analytics — FinanceFlow" },
      {
        property: "og:description",
        content: "Visual insight into your income, spending patterns and savings growth.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const axisProps = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  fontSize: 12,
  background: "var(--card)",
};

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-surface p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-5 h-72">{children}</div>
    </div>
  );
}

function AnalyticsPage() {
  const { formatMoney, transactions } = useFinance();
  const stats = useMonthlyStats();
  const [range, setRange] = useState<"6m" | "all">("6m");

  const history = range === "6m" ? monthlyHistory.slice(-6) : monthlyHistory;

  const categoryData = useMemo(
    () =>
      Object.entries(stats.spentByCategory)
        .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
        .sort((a, b) => b.value - a.value),
    [stats.spentByCategory],
  );

  const savingsRate = stats.income
    ? Math.max(0, ((stats.income - stats.expenses) / stats.income) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Understand the patterns behind your spending and saving."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-surface p-5">
          <p className="text-sm text-muted-foreground">Savings rate</p>
          <p className="mt-1 text-2xl font-semibold text-success tabular-nums">
            {savingsRate.toFixed(0)}%
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm text-muted-foreground">Avg. monthly spend</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {formatMoney(
              monthlyHistory.reduce((s, m) => s + m.expenses, 0) / monthlyHistory.length,
            )}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm text-muted-foreground">Transactions tracked</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{transactions.length}</p>
        </div>
      </div>

      <Tabs value={range} onValueChange={(v) => setRange(v as "6m" | "all")}>
        <TabsList>
          <TabsTrigger value="6m">Last 6 months</TabsTrigger>
          <TabsTrigger value="all">All time</TabsTrigger>
        </TabsList>

        <TabsContent value={range} className="mt-4 space-y-4">
          <ChartCard
            title="Income vs expenses"
            subtitle="How much came in versus how much went out"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} width={48} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => formatMoney(value)}
                  cursor={{ fill: "var(--secondary)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" name="Income" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="var(--chart-4)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Spending by category" subtitle="This month's expense mix">
              {categoryData.length === 0 ? (
                <p className="text-sm text-muted-foreground">No expenses this month yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {categoryData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={categoryColors[entry.name] ?? "var(--chart-2)"}
                        />
                      ))}
                    </Pie>
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value: number) => formatMoney(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="Monthly spending trend" subtitle="Expenses over time">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" {...axisProps} />
                  <YAxis {...axisProps} width={48} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => formatMoney(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="var(--chart-4)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Savings progress" subtitle="Cumulative savings balance">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={range === "6m" ? savingsHistory.slice(-6) : savingsHistory}>
                <defs>
                  <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} width={56} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => formatMoney(value)}
                />
                <Area
                  type="monotone"
                  dataKey="saved"
                  name="Total saved"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  fill="url(#savingsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
