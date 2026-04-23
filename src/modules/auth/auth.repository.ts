import { Injectable } from '@nestjs/common';
import { AuthMeContract } from '@/modules/auth/auth.types';

@Injectable()
export class AuthRepository {
  toContract(userId: string, email: string): AuthMeContract {
    return {
      id: userId,
      email,
    };
  }
}
