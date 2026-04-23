import { Global, Module } from '@nestjs/common';
import { SupabaseService } from '@/infra/supabase/supabase.service';

@Global()
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
