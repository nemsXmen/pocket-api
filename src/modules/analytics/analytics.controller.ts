import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import type { AuthenticatedUser } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/guards/current-user.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { analyticsQuerySchema } from '@/modules/analytics/analytics.schemas';
import { AnalyticsService } from '@/modules/analytics/analytics.service';

@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAnalytics(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(analyticsQuerySchema)) query: unknown,
  ) {
    const { period } = query as { period: 'week' | 'month' | 'year' };
    return this.analyticsService.getAnalytics(user.id, period);
  }
}
