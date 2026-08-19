import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  currencies,
  mockBudgets,
  mockGoals,
  mockTransactions,
  type Budget,
  type Category,
  type Goal,
  type Transaction,
} from "./finance-data";

export type Settings = {
  name: string;
  email: string;
  currency: string;
  notifyBudgetAlerts: boolean;
  notifyGoalMilestones: boolean;
  notifyWeeklyDigest: boolean;
  density: "comfortable" | "compact";
  accentBars: boolean;
};

type Store = {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  settings: Settings;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  upsertBudget: (category: Category, limit: number) => void;
  removeBudget: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  formatMoney: (value: number, opts?: { sign?: boolean }) => string;
};

const FinanceContext = createContext<Store | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [settings, setSettings] = useState<Settings>({
    name: "Alex Mwangi",
    email: "alex.mwangi@example.com",
    currency: "USD",
    notifyBudgetAlerts: true,
    notifyGoalMilestones: true,
    notifyWeeklyDigest: false,
    density: "comfortable",
    accentBars: true,
  });

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...tx, id: uid() }, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const upsertBudget = useCallback((category: Category, limit: number) => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === category);
      if (existing) {
        return prev.map((b) => (b.category === category ? { ...b, limit } : b));
      }
      return [...prev, { id: uid(), category, limit }];
    });
  }, []);

  const removeBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const contributeToGoal = useCallback((id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g,
      ),
    );
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, "id">) => {
    setGoals((prev) => [...prev, { ...goal, id: uid() }]);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const formatMoney = useCallback(
    (value: number, opts?: { sign?: boolean }) => {
      const symbol =
        currencies.find((c) => c.code === settings.currency)?.symbol ?? "$";
      const formatted = Math.abs(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const prefix = opts?.sign ? (value < 0 ? "-" : "+") : value < 0 ? "-" : "";
      return `${prefix}${symbol}${formatted}`;
    },
    [settings.currency],
  );

  const value = useMemo(
    () => ({
      transactions,
      budgets,
      goals,
      settings,
      addTransaction,
      deleteTransaction,
      upsertBudget,
      removeBudget,
      contributeToGoal,
      addGoal,
      updateSettings,
      formatMoney,
    }),
    [
      transactions,
      budgets,
      goals,
      settings,
      addTransaction,
      deleteTransaction,
      upsertBudget,
      removeBudget,
      contributeToGoal,
      addGoal,
      updateSettings,
      formatMoney,
    ],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
}

/** Derived monthly metrics for the current calendar month. */
export function useMonthlyStats() {
  const { transactions, budgets, goals } = useFinance();

  return useMemo(() => {
    const now = new Date();
    const inMonth = transactions.filter((t) => {
      const dt = new Date(t.date);
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    });

    const income = inMonth
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = inMonth
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const spentByCategory = inMonth
      .filter((t) => t.type === "expense")
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {});

    const budgetTotal = budgets.reduce((s, b) => s + b.limit, 0);
    const budgetSpent = budgets.reduce(
      (s, b) => s + (spentByCategory[b.category] ?? 0),
      0,
    );

    const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
    const savedThisMonth = income - expenses;
    const allTimeNet = transactions.reduce(
      (s, t) => s + (t.type === "income" ? t.amount : -t.amount),
      0,
    );

    return {
      income,
      expenses,
      savedThisMonth,
      spentByCategory,
      budgetTotal,
      budgetSpent,
      totalSaved,
      balance: 6250 + allTimeNet,
      transactionsThisMonth: inMonth,
    };
  }, [transactions, budgets, goals]);
}
