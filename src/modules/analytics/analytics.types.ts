import { z } from 'zod';
import { analyticsSchema } from '@/common/types/api-contracts';
import { analyticsQuerySchema } from '@/modules/analytics/analytics.schemas';

export type AnalyticsContract = z.infer<typeof analyticsSchema>;
export type AnalyticsQueryDto = z.infer<typeof analyticsQuerySchema>;
