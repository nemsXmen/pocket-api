import { Global, Module } from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthRepository } from '@/modules/auth/auth.repository';
import { AuthService } from '@/modules/auth/auth.service';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
