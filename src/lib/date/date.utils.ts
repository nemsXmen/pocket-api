import { z } from 'zod';

export function parseDateIso(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new z.ZodError([
      {
        code: 'custom',
        path: ['date'],
        message: `Invalid ISO date: ${value}`,
      },
    ]);
  }

  return parsed;
}

export function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}
