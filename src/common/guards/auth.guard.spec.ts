import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import { SupabaseService } from '@/infra/supabase/supabase.service';

describe('AuthGuard', () => {
  const createExecutionContext = (authorization?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: authorization ? { authorization } : {},
        }),
      }),
    }) as ExecutionContext;

  it('rejects requests without a bearer token', async () => {
    const supabaseService = {
      admin: {
        auth: {
          getUser: jest.fn(),
        },
      },
    } as unknown as SupabaseService;
    const guard = new AuthGuard(supabaseService);

    await expect(guard.canActivate(createExecutionContext())).rejects.toThrow(
      new UnauthorizedException('Missing Authorization header'),
    );
  });

  it('rejects invalid tokens returned by Supabase', async () => {
    const supabaseService = {
      admin: {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: new Error('bad token'),
          }),
        },
      },
    } as unknown as SupabaseService;
    const guard = new AuthGuard(supabaseService);

    await expect(
      guard.canActivate(createExecutionContext('Bearer invalid-token')),
    ).rejects.toThrow(
      new UnauthorizedException('Invalid or expired bearer token'),
    );
  });

  it('attaches the authenticated Supabase user to the request', async () => {
    const request = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };
    const supabaseService = {
      admin: {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'user@example.com',
              },
            },
            error: null,
          }),
        },
      },
    } as unknown as SupabaseService;
    const guard = new AuthGuard(supabaseService);
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request).toMatchObject({
      user: {
        id: 'user-123',
        email: 'user@example.com',
      },
    });
  });
});
