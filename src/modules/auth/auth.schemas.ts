import { z } from 'zod';

export const authMeSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});
