import { Injectable } from '@nestjs/common';
import { AuthRepository } from '@/modules/auth/auth.repository';
import { mapAuthMeContract } from '@/modules/auth/auth.mapper';
import { AuthMeContract } from '@/modules/auth/auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  me(userId: string, email: string): AuthMeContract {
    return mapAuthMeContract(this.authRepository.toContract(userId, email));
  }
}
