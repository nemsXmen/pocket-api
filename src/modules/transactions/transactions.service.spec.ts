import { BadRequestException } from '@nestjs/common';
import { TransactionsService } from '@/modules/transactions/transactions.service';

describe('TransactionsService', () => {
  const transactionsRepository = {
    createForUser: jest.fn(),
    findManyByUser: jest.fn(),
    findByIdForUser: jest.fn(),
    updateForUser: jest.fn(),
    deleteForUser: jest.fn(),
  };

  const categoriesRepository = {
    findByIdForUser: jest.fn(),
  };

  const service = new TransactionsService(
    transactionsRepository as never,
    categoriesRepository as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects transaction when category does not belong to user', async () => {
    categoriesRepository.findByIdForUser.mockResolvedValue(null);

    await expect(
      service.create('user-1', {
        title: 'Groceries',
        amount: 120,
        type: 'OUTCOME',
        categoryId: 'cat-1',
        categoryName: 'Food',
        date: '2026-04-23',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects transaction when category type does not match', async () => {
    categoriesRepository.findByIdForUser.mockResolvedValue({ type: 'INCOME' });

    await expect(
      service.create('user-1', {
        title: 'Groceries',
        amount: 120,
        type: 'OUTCOME',
        categoryId: 'cat-1',
        categoryName: 'Food',
        date: '2026-04-23',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
