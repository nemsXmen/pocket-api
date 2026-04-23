import { Transaction } from '@/common/types/api-contracts';
import { TransactionRow } from '@/infra/supabase/supabase.types';
import { fromMinorUnits } from '@/lib/money/money.utils';

export function mapTransactionRowToContract(row: TransactionRow): Transaction {
  return {
    id: row.id,
    title: row.title,
    amount: fromMinorUnits(row.amount_minor),
    type: row.type,
    categoryId: row.category_id,
    categoryName: row.category_name,
    date: row.date,
    ...(row.note ? { note: row.note } : {}),
  };
}
