import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '@/infra/supabase/supabase.service';

export type AuthenticatedUser = {
  id: string;
  email: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const authorizationHeader = request.headers.authorization;
    const accessToken = this.extractBearerToken(authorizationHeader);

    const {
      data: { user },
      error,
    } = await this.supabaseService.admin.auth.getUser(accessToken);

    if (error || !user) {
      throw new UnauthorizedException('Invalid or expired bearer token');
    }

    if (!user.email) {
      throw new UnauthorizedException('Authenticated user is missing an email');
    }

    request.user = {
      id: user.id,
      email: user.email,
    };

    return true;
  }

  private extractBearerToken(authorizationHeader?: string): string {
    if (!authorizationHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token?.trim()) {
      throw new UnauthorizedException(
        'Authorization header must use the Bearer scheme',
      );
    }

    return token;
  }
}
