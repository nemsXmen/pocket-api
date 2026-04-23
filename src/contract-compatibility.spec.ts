import {
  analyticsSchema,
  categorySchema,
  dashboardSummarySchema,
  settingsSchema,
  transactionSchema,
} from '@/common/types/api-contracts';

describe('contract compatibility', () => {
  it('matches Transaction contract', () => {
    const payload = {
      id: 'txn-1',
      title: 'Salary',
      amount: 1000,
      type: 'INCOME',
      categoryId: 'cat-1',
      categoryName: 'Salary',
      date: '2026-04-23',
      note: 'Payroll',
    };

    expect(transactionSchema.parse(payload)).toEqual(payload);
  });

  it('matches Category contract', () => {
    const payload = {
      id: 'cat-1',
      name: 'Food',
      type: 'OUTCOME',
      icon: 'utensils',
      color: '#F97316',
    };

    expect(categorySchema.parse(payload)).toEqual(payload);
  });

  it('matches DashboardSummary contract', () => {
    const payload = {
      balance: 15780,
      totalIncome: 6620,
      totalExpense: 2308,
      monthlyChangePercent: 12.4,
    };

    expect(dashboardSummarySchema.parse(payload)).toEqual(payload);
  });

  it('matches Analytics contract', () => {
    const payload = {
      period: 'month',
      categoryBreakdown: [
        {
          categoryId: 'cat-1',
          categoryName: 'Food',
          amount: 780,
          percentage: 22,
          color: '#F97316',
        },
      ],
      incomeVsOutcome: [{ label: 'W1', income: 5520, outcome: 1845 }],
      cashflowSeries: [
        { label: '2026-04-01', income: 5200, outcome: 120, balance: 5080 },
      ],
    };

    expect(() => analyticsSchema.parse(payload)).not.toThrow();
  });

  it('matches Settings contract', () => {
    const payload = {
      userName: 'Alex Morgan',
      email: 'alex@pocket.app',
      currency: 'USD',
      theme: 'Dark',
      notifications: true,
    };

    expect(settingsSchema.parse(payload)).toEqual(payload);
  });
});
