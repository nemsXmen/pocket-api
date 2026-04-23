import { z } from 'zod';

export function positiveAmountSchema(field = 'amount') {
  return z.number().positive(`${field} must be greater than zero`);
}
