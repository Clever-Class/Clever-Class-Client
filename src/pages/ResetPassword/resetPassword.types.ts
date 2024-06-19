import { z } from 'zod';

import { resetPasswordSchema } from './resetPasswordSchema';

export type ResetPasswordFormTypes = z.infer<typeof resetPasswordSchema>;
