import { Module } from '@nestjs/common';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { TransactionsModule } from '@/modules/transactions/transactions.module';
import { AnalyticsController } from '@/modules/analytics/analytics.controller';
import { AnalyticsRepository } from '@/modules/analytics/analytics.repository';
import { AnalyticsService } from '@/modules/analytics/analytics.service';

@Module({
  imports: [TransactionsModule, CategoriesModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
