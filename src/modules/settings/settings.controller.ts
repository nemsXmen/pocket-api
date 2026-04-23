import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import type { AuthenticatedUser } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/guards/current-user.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { updateSettingsSchema } from '@/modules/settings/settings.schemas';
import { SettingsService } from '@/modules/settings/settings.service';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.get(user.id, user.email);
  }

  @Patch()
  patchSettings(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(updateSettingsSchema)) body: unknown,
  ) {
    return this.settingsService.update(user.id, user.email, body as never);
  }
}
