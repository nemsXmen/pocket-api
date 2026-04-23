import { z } from 'zod';
import { transactionSchema } from '@/common/types/api-contracts';
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionsQuerySchema,
} from '@/modules/transactions/transactions.schemas';

export type TransactionContract = z.infer<typeof transactionSchema>;
export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>;
export type TransactionsQueryDto = z.infer<typeof transactionsQuerySchema>;
