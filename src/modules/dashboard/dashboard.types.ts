import { z } from 'zod';
import { dashboardResponseSchema } from '@/modules/dashboard/dashboard.schemas';

export type DashboardContract = z.infer<typeof dashboardResponseSchema>;
