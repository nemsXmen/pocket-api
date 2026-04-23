import { Injectable } from '@nestjs/common';
import { DashboardSummary } from '@/common/types/api-contracts';
import { toIsoDate } from '@/lib/date/date.utils';
import { TransactionsRepository } from '@/modules/transactions/transactions.repository';
import { transactionsQuerySchema } from '@/modules/transactions/transactions.schemas';

@Injectable()
export class DashboardRepository {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async computeSummary(userId: string): Promise<DashboardSummary> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentRows = await this.transactionsRepository.findManyByUser(
      userId,
      transactionsQuerySchema.parse({
        page: 1,
        pageSize: 500,
        startDate: toIsoDate(monthStart),
        endDate: toIsoDate(now),
      }),
    );

    const previousRows = await this.transactionsRepository.findManyByUser(
      userId,
      transactionsQuerySchema.parse({
        page: 1,
        pageSize: 500,
        startDate: toIsoDate(prevMonthStart),
        endDate: toIsoDate(prevMonthEnd),
      }),
    );

    const totalIncome = currentRows
      .filter((row) => row.type === 'INCOME')
      .reduce((sum, row) => sum + row.amount_minor / 100, 0);

    const totalExpense = currentRows
      .filter((row) => row.type === 'OUTCOME')
      .reduce((sum, row) => sum + row.amount_minor / 100, 0);

    const previousNet = previousRows.reduce((sum, row) => {
      const amount = row.amount_minor / 100;
      return sum + (row.type === 'INCOME' ? amount : -amount);
    }, 0);

    const currentNet = totalIncome - totalExpense;
    const monthlyChangePercent =
      previousNet === 0
        ? 0
        : ((currentNet - previousNet) / Math.abs(previousNet)) * 100;

    return {
      balance: currentNet,
      totalIncome,
      totalExpense,
      monthlyChangePercent,
    };
  }
}
