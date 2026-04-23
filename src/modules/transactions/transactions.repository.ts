import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SUPABASE_TABLES } from '@/common/constants/supabase.constants';
import { SupabaseService } from '@/infra/supabase/supabase.service';
import { TransactionRow } from '@/infra/supabase/supabase.types';
import {
  CreateTransactionDto,
  TransactionsQueryDto,
  UpdateTransactionDto,
} from '@/modules/transactions/transactions.types';
import { toMinorUnits } from '@/lib/money/money.utils';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findManyByUser(
    userId: string,
    query: TransactionsQueryDto,
  ): Promise<TransactionRow[]> {
    let statement = (this.supabase.admin as any)
      .from(SUPABASE_TABLES.TRANSACTIONS)
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (query.type) statement = statement.eq('type', query.type);
    if (query.categoryId)
      statement = statement.eq('category_id', query.categoryId);
    if (query.startDate) statement = statement.gte('date', query.startDate);
    if (query.endDate) statement = statement.lte('date', query.endDate);
    if (query.search) statement = statement.ilike('title', `%${query.search}%`);

    const from = (query.page - 1) * query.pageSize;
    const to = from + query.pageSize - 1;
    statement = statement.range(from, to);

    const { data, error } = await statement;

    if (error) throw error;
    return (data ?? []) as TransactionRow[];
  }

  async findByIdForUser(
    userId: string,
    id: string,
  ): Promise<TransactionRow | null> {
    const { data, error } = await (this.supabase.admin as any)
      .from(SUPABASE_TABLES.TRANSACTIONS)
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return (data as TransactionRow | null) ?? null;
  }

  async createForUser(
    userId: string,
    input: CreateTransactionDto,
  ): Promise<TransactionRow> {
    const payload: TransactionRow = {
      id: randomUUID(),
      user_id: userId,
      title: input.title,
      amount_minor: toMinorUnits(input.amount),
      type: input.type,
      category_id: input.categoryId,
      category_name: input.categoryName,
      date: input.date,
      note: input.note ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await (this.supabase.admin as any)
      .from(SUPABASE_TABLES.TRANSACTIONS)
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data as TransactionRow;
  }

  async updateForUser(
    userId: string,
    id: string,
    input: UpdateTransactionDto,
  ): Promise<TransactionRow> {
    const { data, error } = await (this.supabase.admin as any)
      .from(SUPABASE_TABLES.TRANSACTIONS)
      .update({
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.amount !== undefined
          ? { amount_minor: toMinorUnits(input.amount) }
          : {}),
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.categoryId !== undefined
          ? { category_id: input.categoryId }
          : {}),
        ...(input.categoryName !== undefined
          ? { category_name: input.categoryName }
          : {}),
        ...(input.date !== undefined ? { date: input.date } : {}),
        ...(input.note !== undefined ? { note: input.note } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new NotFoundException('Transaction not found');
    }

    return data as TransactionRow;
  }

  async deleteForUser(userId: string, id: string): Promise<void> {
    const { error } = await (this.supabase.admin as any)
      .from(SUPABASE_TABLES.TRANSACTIONS)
      .delete()
      .eq('user_id', userId)
      .eq('id', id);

    if (error) throw error;
  }
}
