import { z } from 'zod';
import { analyticsPeriodSchema } from '@/common/types/api-contracts';

export const analyticsQuerySchema = z.object({
  period: analyticsPeriodSchema,
});
