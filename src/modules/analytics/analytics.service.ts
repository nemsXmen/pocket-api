import { Injectable } from '@nestjs/common';
import { Analytics } from '@/common/types/api-contracts';
import { mapAnalyticsContract } from '@/modules/analytics/analytics.mapper';
import { AnalyticsRepository } from '@/modules/analytics/analytics.repository';
import { AnalyticsPeriod } from '@/common/types/api-contracts';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async getAnalytics(
    userId: string,
    period: AnalyticsPeriod,
  ): Promise<Analytics> {
    const analytics = await this.analyticsRepository.computeAnalytics(
      userId,
      period,
    );
    return mapAnalyticsContract(analytics);
  }
}
