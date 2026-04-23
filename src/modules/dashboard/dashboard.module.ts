import { Module } from '@nestjs/common';
import { TransactionsModule } from '@/modules/transactions/transactions.module';
import { DashboardController } from '@/modules/dashboard/dashboard.controller';
import { DashboardRepository } from '@/modules/dashboard/dashboard.repository';
import { DashboardService } from '@/modules/dashboard/dashboard.service';

@Module({
  imports: [TransactionsModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
  exports: [DashboardService],
})
export class DashboardModule {}
