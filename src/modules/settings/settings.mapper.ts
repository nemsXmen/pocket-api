import { Settings } from '@/common/types/api-contracts';
import { SettingsRow } from '@/infra/supabase/supabase.types';

export function mapSettingsRowToContract(row: SettingsRow): Settings {
  return {
    userName: row.user_name,
    email: row.email,
    currency: row.currency,
    theme: row.theme,
    notifications: row.notifications,
  };
}
