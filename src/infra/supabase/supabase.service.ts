import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Env } from '@/common/config/env.schema';
import { SupabaseDatabase } from '@/infra/supabase/supabase.types';

@Injectable()
export class SupabaseService {
  private readonly adminClient: SupabaseClient<SupabaseDatabase>;

  constructor(private readonly configService: ConfigService<Env, true>) {
    this.adminClient = createClient<SupabaseDatabase>(
      this.configService.get('SUPABASE_URL', { infer: true }),
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY', { infer: true }),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }

  get admin(): SupabaseClient<SupabaseDatabase> {
    return this.adminClient;
  }
}
