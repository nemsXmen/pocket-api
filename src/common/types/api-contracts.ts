import { z } from 'zod';

export const transactionTypeSchema = z.enum(['INCOME', 'OUTCOME']);
export const analyticsPeriodSchema = z.enum(['week', 'month', 'year']);

export const transactionSchema = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.number(),
  type: transactionTypeSchema,
  categoryId: z.string(),
  categoryName: z.string(),
  date: z.string(),
  note: z.string().optional(),
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: transactionTypeSchema,
  icon: z.string(),
  color: z.string(),
});

export const dashboardSummarySchema = z.object({
  balance: z.number(),
  totalIncome: z.number(),
  totalExpense: z.number(),
  monthlyChangePercent: z.number(),
});

export const analyticsCategoryBreakdownItemSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  amount: z.number(),
  percentage: z.number(),
  color: z.string(),
});

export const analyticsIncomeVsOutcomeItemSchema = z.object({
  label: z.string(),
  income: z.number(),
  outcome: z.number(),
});

export const cashflowSeriesItemSchema = z.object({
  label: z.string(),
  income: z.number(),
  outcome: z.number(),
  balance: z.number(),
});

export const analyticsSchema = z.object({
  period: analyticsPeriodSchema,
  categoryBreakdown: z.array(analyticsCategoryBreakdownItemSchema),
  incomeVsOutcome: z.array(analyticsIncomeVsOutcomeItemSchema),
  cashflowSeries: z.array(cashflowSeriesItemSchema),
});

export const settingsSchema = z.object({
  userName: z.string(),
  email: z.string().email(),
  currency: z.string(),
  theme: z.string(),
  notifications: z.boolean(),
});

export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type AnalyticsPeriod = z.infer<typeof analyticsPeriodSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Category = z.infer<typeof categorySchema>;
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
export type Analytics = z.infer<typeof analyticsSchema>;
export type Settings = z.infer<typeof settingsSchema>;
