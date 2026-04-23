import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import type { AuthenticatedUser } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/guards/current-user.decorator';
import { DashboardService } from '@/modules/dashboard/dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getSummary(user.id);
  }
}
