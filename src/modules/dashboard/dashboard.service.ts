import { Injectable } from '@nestjs/common';
import { DashboardSummary } from '@/common/types/api-contracts';
import { mapDashboardSummary } from '@/modules/dashboard/dashboard.mapper';
import { DashboardRepository } from '@/modules/dashboard/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getSummary(userId: string): Promise<DashboardSummary> {
    const summary = await this.dashboardRepository.computeSummary(userId);
    return mapDashboardSummary(summary);
  }
}
