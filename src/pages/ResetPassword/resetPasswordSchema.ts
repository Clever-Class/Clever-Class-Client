import { z } from 'zod';

export const resetPasswordSchema = z.object({
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  confirmPassword: z.string().min(8, {
    message: 'Confirm password must be at least 8 characters.',
  }),
});
