import { z } from 'zod';
import {
  transactionSchema,
  transactionTypeSchema,
} from '@/common/types/api-contracts';
import { positiveAmountSchema } from '@/lib/zod/zod.utils';

export const createTransactionSchema = transactionSchema
  .omit({ id: true })
  .extend({
    amount: positiveAmountSchema('amount'),
  });

export const updateTransactionSchema = createTransactionSchema
  .partial()
  .extend({
    amount: positiveAmountSchema('amount').optional(),
  })
  .refine(
    (input) => Object.keys(input).length > 0,
    'At least one field must be provided',
  );

export const transactionIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const transactionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  type: transactionTypeSchema.optional(),
  categoryId: z.string().min(1).optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  search: z.string().trim().min(1).optional(),
});
