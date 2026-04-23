import { Injectable } from '@nestjs/common';
import { SUPABASE_TABLES } from '@/common/constants/supabase.constants';
import { SupabaseService } from '@/infra/supabase/supabase.service';
import { SettingsRow } from '@/infra/supabase/supabase.types';
import { UpdateSettingsDto } from '@/modules/settings/settings.types';

@Injectable()
export class SettingsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findByUserId(userId: string): Promise<SettingsRow | null> {
    const { data, error } = await (this.supabase.admin as any)
      .from(SUPABASE_TABLES.SETTINGS)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return (data as SettingsRow | null) ?? null;
  }

  async upsert(
    userId: string,
    input: UpdateSettingsDto,
    defaultEmail: string,
  ): Promise<SettingsRow> {
    const existing = await this.findByUserId(userId);

    const payload: SettingsRow = {
      user_id: userId,
      user_name: input.userName ?? existing?.user_name ?? 'Pocket User',
      email: input.email ?? existing?.email ?? defaultEmail,
      currency: input.currency ?? existing?.currency ?? 'USD',
      theme: input.theme ?? existing?.theme ?? 'Dark',
      notifications: input.notifications ?? existing?.notifications ?? true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await (this.supabase.admin as any)
      .from(SUPABASE_TABLES.SETTINGS)
      .upsert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data as SettingsRow;
  }
}
