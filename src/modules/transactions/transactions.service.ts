import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transaction } from '@/common/types/api-contracts';
import { CategoriesRepository } from '@/modules/categories/categories.repository';
import { mapTransactionRowToContract } from '@/modules/transactions/transactions.mapper';
import { TransactionsRepository } from '@/modules/transactions/transactions.repository';
import {
  CreateTransactionDto,
  TransactionsQueryDto,
  UpdateTransactionDto,
} from '@/modules/transactions/transactions.types';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async create(
    userId: string,
    input: CreateTransactionDto,
  ): Promise<Transaction> {
    await this.assertCategoryCompatibility(
      userId,
      input.categoryId,
      input.type,
    );
    const row = await this.transactionsRepository.createForUser(userId, input);
    return mapTransactionRowToContract(row);
  }

  async findAll(
    userId: string,
    query: TransactionsQueryDto,
  ): Promise<Transaction[]> {
    const rows = await this.transactionsRepository.findManyByUser(
      userId,
      query,
    );
    return rows.map(mapTransactionRowToContract);
  }

  async findOne(userId: string, id: string): Promise<Transaction> {
    const row = await this.transactionsRepository.findByIdForUser(userId, id);
    if (!row) {
      throw new NotFoundException('Transaction not found');
    }

    return mapTransactionRowToContract(row);
  }

  async update(
    userId: string,
    id: string,
    input: UpdateTransactionDto,
  ): Promise<Transaction> {
    if (input.categoryId && input.type) {
      await this.assertCategoryCompatibility(
        userId,
        input.categoryId,
        input.type,
      );
    }

    const row = await this.transactionsRepository.updateForUser(
      userId,
      id,
      input,
    );
    return mapTransactionRowToContract(row);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.transactionsRepository.deleteForUser(userId, id);
  }

  private async assertCategoryCompatibility(
    userId: string,
    categoryId: string,
    transactionType: 'INCOME' | 'OUTCOME',
  ): Promise<void> {
    const category = await this.categoriesRepository.findByIdForUser(
      userId,
      categoryId,
    );

    if (!category) {
      throw new BadRequestException(
        'categoryId does not belong to current user',
      );
    }

    if (category.type !== transactionType) {
      throw new BadRequestException(
        'Category type must match transaction type',
      );
    }
  }
}
