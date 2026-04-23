import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import type { AuthenticatedUser } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/guards/current-user.decorator';
import { AuthService } from '@/modules/auth/auth.service';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user.id, user.email);
  }
}
