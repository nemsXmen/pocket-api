import { Injectable } from '@nestjs/common';
import { Analytics, AnalyticsPeriod } from '@/common/types/api-contracts';
import { CategoriesRepository } from '@/modules/categories/categories.repository';
import { TransactionsRepository } from '@/modules/transactions/transactions.repository';
import { transactionsQuerySchema } from '@/modules/transactions/transactions.schemas';

@Injectable()
export class AnalyticsRepository {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async computeAnalytics(
    userId: string,
    period: AnalyticsPeriod,
  ): Promise<Analytics> {
    const now = new Date();
    const lookbackDays = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const start = new Date(now);
    start.setDate(now.getDate() - lookbackDays);

    const rows = await this.transactionsRepository.findManyByUser(
      userId,
      transactionsQuerySchema.parse({
        page: 1,
        pageSize: 1000,
        startDate: start.toISOString().slice(0, 10),
        endDate: now.toISOString().slice(0, 10),
      }),
    );

    const categories = await this.categoriesRepository.findManyByUser(
      userId,
      {},
    );
    const outcomeRows = rows.filter((row) => row.type === 'OUTCOME');
    const totalOutcome = outcomeRows.reduce(
      (sum, row) => sum + row.amount_minor / 100,
      0,
    );

    const categoryBreakdown = categories
      .filter((category) => category.type === 'OUTCOME')
      .map((category) => {
        const amount = outcomeRows
          .filter((row) => row.category_id === category.id)
          .reduce((sum, row) => sum + row.amount_minor / 100, 0);

        return {
          categoryId: category.id,
          categoryName: category.name,
          amount,
          percentage:
            totalOutcome === 0
              ? 0
              : Number(((amount / totalOutcome) * 100).toFixed(2)),
          color: category.color,
        };
      })
      .filter((item) => item.amount > 0);

    const income = rows
      .filter((row) => row.type === 'INCOME')
      .reduce((sum, row) => sum + row.amount_minor / 100, 0);
    const outcome = rows
      .filter((row) => row.type === 'OUTCOME')
      .reduce((sum, row) => sum + row.amount_minor / 100, 0);

    const incomeVsOutcome = [
      {
        label: period === 'year' ? 'YTD' : period === 'month' ? 'MTD' : 'WTD',
        income,
        outcome,
      },
    ];

    let runningBalance = 0;
    const cashflowSeries = rows
      .slice()
      .reverse()
      .map((row) => {
        const amount = row.amount_minor / 100;
        runningBalance += row.type === 'INCOME' ? amount : -amount;

        return {
          label: row.date,
          income: row.type === 'INCOME' ? amount : 0,
          outcome: row.type === 'OUTCOME' ? amount : 0,
          balance: runningBalance,
        };
      });

    return {
      period,
      categoryBreakdown,
      incomeVsOutcome,
      cashflowSeries,
    };
  }
}
