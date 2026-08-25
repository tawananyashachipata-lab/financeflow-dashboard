export type TxType = "income" | "expense";

export type Category =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Health"
  | "Salary"
  | "Freelance"
  | "Other";

export const expenseCategories: Category[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

export const incomeCategories: Category[] = ["Salary", "Freelance", "Other"];

export type Transaction = {
  id: string;
  title: string;
  merchant: string;
  category: Category;
  type: TxType;
  amount: number;
  date: string; // ISO yyyy-mm-dd
};

export type Budget = {
  id: string;
  category: Category;
  limit: number;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  emoji: string;
};

const today = new Date();
const d = (daysAgo: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - daysAgo);
  return dt.toISOString().slice(0, 10);
};

export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    title: "Monthly salary",
    merchant: "Nordwind Studios",
    category: "Salary",
    type: "income",
    amount: 3850,
    date: d(2),
  },
  {
    id: "t2",
    title: "Grocery run",
    merchant: "Fresh Market",
    category: "Food",
    type: "expense",
    amount: 86.4,
    date: d(1),
  },
  {
    id: "t3",
    title: "Metro card top-up",
    merchant: "City Transit",
    category: "Transport",
    type: "expense",
    amount: 45,
    date: d(1),
  },
  {
    id: "t4",
    title: "Coffee & pastry",
    merchant: "Bluebird Coffee",
    category: "Food",
    type: "expense",
    amount: 12.75,
    date: d(3),
  },
  {
    id: "t5",
    title: "Streaming bundle",
    merchant: "Streamly",
    category: "Entertainment",
    type: "expense",
    amount: 21.99,
    date: d(4),
  },
  {
    id: "t6",
    title: "Sneakers",
    merchant: "Runline",
    category: "Shopping",
    type: "expense",
    amount: 139.9,
    date: d(5),
  },
  {
    id: "t7",
    title: "Website redesign",
    merchant: "Maple Agency",
    category: "Freelance",
    type: "income",
    amount: 640,
    date: d(6),
  },
  {
    id: "t8",
    title: "Electricity bill",
    merchant: "GridCo",
    category: "Bills",
    type: "expense",
    amount: 92.3,
    date: d(7),
  },
  {
    id: "t9",
    title: "Gym membership",
    merchant: "PulseFit",
    category: "Health",
    type: "expense",
    amount: 39,
    date: d(8),
  },
  {
    id: "t10",
    title: "Dinner with friends",
    merchant: "Osteria Nove",
    category: "Food",
    type: "expense",
    amount: 64.2,
    date: d(9),
  },
  {
    id: "t11",
    title: "Rideshare home",
    merchant: "Zipp",
    category: "Transport",
    type: "expense",
    amount: 18.5,
    date: d(10),
  },
  {
    id: "t12",
    title: "Phone plan",
    merchant: "Telcom",
    category: "Bills",
    type: "expense",
    amount: 35,
    date: d(12),
  },
  {
    id: "t13",
    title: "Concert ticket",
    merchant: "LiveNation",
    category: "Entertainment",
    type: "expense",
    amount: 78,
    date: d(14),
  },
  {
    id: "t14",
    title: "Bookstore",
    merchant: "Page & Co",
    category: "Shopping",
    type: "expense",
    amount: 42.6,
    date: d(16),
  },
  {
    id: "t15",
    title: "Pharmacy",
    merchant: "Wellcare",
    category: "Health",
    type: "expense",
    amount: 27.4,
    date: d(18),
  },
  {
    id: "t16",
    title: "Weekly groceries",
    merchant: "Fresh Market",
    category: "Food",
    type: "expense",
    amount: 104.15,
    date: d(20),
  },
  {
    id: "t17",
    title: "Logo design gig",
    merchant: "Brightly",
    category: "Freelance",
    type: "income",
    amount: 320,
    date: d(21),
  },
  {
    id: "t18",
    title: "Internet bill",
    merchant: "FiberNet",
    category: "Bills",
    type: "expense",
    amount: 49.99,
    date: d(23),
  },
  {
    id: "t19",
    title: "Cinema night",
    merchant: "Cineplex",
    category: "Entertainment",
    type: "expense",
    amount: 26,
    date: d(25),
  },
  {
    id: "t20",
    title: "Train ticket",
    merchant: "RailGo",
    category: "Transport",
    type: "expense",
    amount: 58.4,
    date: d(27),
  },
];

export const mockBudgets: Budget[] = [
  { id: "b1", category: "Food", limit: 600 },
  { id: "b2", category: "Transport", limit: 220 },
  { id: "b3", category: "Shopping", limit: 300 },
  { id: "b4", category: "Bills", limit: 400 },
  { id: "b5", category: "Entertainment", limit: 180 },
];

export const mockGoals: Goal[] = [
  { id: "g1", name: "New Laptop", target: 2200, saved: 1480, deadline: "2026-12-01", emoji: "💻" },
  {
    id: "g2",
    name: "Emergency Fund",
    target: 6000,
    saved: 3750,
    deadline: "2027-06-30",
    emoji: "🛟",
  },
  { id: "g3", name: "Vacation", target: 3000, saved: 820, deadline: "2027-02-15", emoji: "🏝️" },
  { id: "g4", name: "New Phone", target: 1100, saved: 1100, deadline: "2026-09-01", emoji: "📱" },
];

export const monthlyHistory = [
  { month: "Feb", income: 4100, expenses: 2840 },
  { month: "Mar", income: 4320, expenses: 3120 },
  { month: "Apr", income: 3980, expenses: 2610 },
  { month: "May", income: 4510, expenses: 3340 },
  { month: "Jun", income: 4290, expenses: 2980 },
  { month: "Jul", income: 4680, expenses: 3210 },
  { month: "Aug", income: 4490, expenses: 2760 },
];

export const savingsHistory = [
  { month: "Feb", saved: 4200 },
  { month: "Mar", saved: 5400 },
  { month: "Apr", saved: 6770 },
  { month: "May", saved: 7940 },
  { month: "Jun", saved: 9250 },
  { month: "Jul", saved: 10720 },
  { month: "Aug", saved: 12450 },
];

export const categoryColors: Record<string, string> = {
  Food: "var(--chart-1)",
  Transport: "var(--chart-2)",
  Shopping: "var(--chart-3)",
  Bills: "var(--chart-4)",
  Entertainment: "var(--chart-5)",
  Health: "var(--muted-foreground)",
  Other: "var(--muted-foreground)",
  Salary: "var(--chart-1)",
  Freelance: "var(--chart-2)",
};

export const currencies = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "ZAR", symbol: "R", label: "South African Rand" },
];
