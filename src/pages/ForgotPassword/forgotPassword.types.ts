import { z } from 'zod';

import { forgotPasswordFormSchema } from './forgotPasswordSchema';

export type ForgotPasswordFormTypes = z.infer<typeof forgotPasswordFormSchema>;
