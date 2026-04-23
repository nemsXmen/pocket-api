import { z } from 'zod';
import {
  categorySchema,
  transactionTypeSchema,
} from '@/common/types/api-contracts';

export const createCategorySchema = categorySchema.omit({ id: true });

export const updateCategorySchema = createCategorySchema
  .partial()
  .refine(
    (input) => Object.keys(input).length > 0,
    'At least one field must be provided',
  );

export const categoryIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const categoriesQuerySchema = z.object({
  type: transactionTypeSchema.optional(),
});
