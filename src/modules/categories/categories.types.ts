import { z } from 'zod';
import { categorySchema } from '@/common/types/api-contracts';
import {
  createCategorySchema,
  updateCategorySchema,
  categoriesQuerySchema,
} from '@/modules/categories/categories.schemas';

export type CategoryContract = z.infer<typeof categorySchema>;
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
export type CategoriesQueryDto = z.infer<typeof categoriesQuerySchema>;
