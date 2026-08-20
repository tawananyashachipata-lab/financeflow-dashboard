# FinanceFlow Dashboard

Build a modern, professional frontend-only personal finance management web app called “FinanceFlow” using React + TypeScript.

Purpose

FinanceFlow helps young adults easily understand where their money goes, manage budgets, track expenses, and work toward savings goals.

Important

- FRONTEND ONLY.

- Do NOT use Supabase, authentication, databases, APIs, or any backend.

- Use realistic mock data throughout the application.

- Make all navigation, buttons, filters, tabs, and interactions functional using frontend state.

- Do not include any Lovable branding or references.

Design

Use a clean, modern fintech design with:

- Primary: Deep Navy "#0F172A"

- Secondary: Emerald Green "#10B981"

- Background: "#F8FAFC"

- Cards: "#FFFFFF"

- Text: "#1E293B"

- Secondary text: "#64748B"

- Borders: "#E2E8F0"

- Warning: "#F59E0B"

- Danger/expenses: "#EF4444"

Use a professional sans-serif font such as Inter. Use rounded cards, subtle shadows, clean spacing, and a polished dashboard aesthetic. Avoid excessive gradients and unnecessary animations.

Pages

1. Dashboard

- Welcome message

- Total balance

- Monthly income

- Monthly expenses

- Savings amount

- Budget progress

- Recent transactions

- Spending-by-category chart

- Savings goal progress

- Quick action buttons

2. Transactions

- List of transactions

- Income and expense indicators

- Category

- Date

- Amount

- Search

- Category filter

- Income/expense filter

- Add transaction modal using frontend state

3. Budget

- Monthly budget overview

- Category budgets such as Food, Transport, Shopping, Bills and Entertainment

- Progress bars showing budget usage

- Amount spent vs remaining

- Add/edit budget interface

4. Savings Goals

Allow users to visually track goals such as:

- New Laptop

- Emergency Fund

- Vacation

- New Phone

Each goal should show target amount, saved amount, percentage progress and remaining amount.

5. Analytics

Create attractive charts showing:

- Monthly income vs expenses

- Spending by category

- Monthly spending trends

- Savings progress

6. Settings

Include profile information, currency preference, notification preferences and appearance settings.

Navigation

Create a responsive sidebar on desktop with:

- Dashboard

- Transactions

- Budget

- Savings Goals

- Analytics

- Settings

On mobile, use a responsive bottom navigation or collapsible menu.

UX

- Make the dashboard immediately understandable.

- Clearly distinguish income from expenses.

- Use green for positive financial progress and red only for expenses/warnings.

- Add empty states where appropriate.

- Include hover states, loading states and confirmation feedback.

- Make the entire application responsive for desktop, tablet and mobile.

- Ensure buttons are large enough and clearly readable.

- Follow good accessibility practices.

Technical requirements

- React + TypeScript

- Reusable components

- Clean component structure

- Responsive CSS/Tailwind

- Use mock data

- Use frontend state for interactions

- Use a chart library for the analytics charts

- Keep the code clean and maintainable.

The final result should look like a real fintech SaaS product that could be showcased in a professional software developer portfolio, not a basic template.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ab4c87c3-87e0-47d5-8eb2-b2764d015c7a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
