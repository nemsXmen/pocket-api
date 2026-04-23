import { z } from 'zod';
import { settingsSchema } from '@/common/types/api-contracts';
import { updateSettingsSchema } from '@/modules/settings/settings.schemas';

export type SettingsContract = z.infer<typeof settingsSchema>;
export type UpdateSettingsDto = z.infer<typeof updateSettingsSchema>;
