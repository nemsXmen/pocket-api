import { settingsSchema } from '@/common/types/api-contracts';

export const updateSettingsSchema = settingsSchema
  .partial()
  .refine(
    (input) => Object.keys(input).length > 0,
    'At least one field must be provided',
  );
