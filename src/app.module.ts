import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from '@/common/config/env.schema';
import { SupabaseModule } from '@/infra/supabase/supabase.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { TransactionsModule } from '@/modules/transactions/transactions.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { DashboardModule } from '@/modules/dashboard/dashboard.module';
import { AnalyticsModule } from '@/modules/analytics/analytics.module';
import { SettingsModule } from '@/modules/settings/settings.module';
import { AppController } from '@/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    SupabaseModule,
    AuthModule,
    TransactionsModule,
    CategoriesModule,
    DashboardModule,
    AnalyticsModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
