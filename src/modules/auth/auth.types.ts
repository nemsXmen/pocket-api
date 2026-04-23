import { z } from 'zod';
import { authMeSchema } from '@/modules/auth/auth.schemas';

export type AuthMeContract = z.infer<typeof authMeSchema>;
