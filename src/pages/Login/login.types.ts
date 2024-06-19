import { z } from 'zod';

import { loginFormSchema } from './loginSchema';

export type FormSchemaTypes = z.infer<typeof loginFormSchema>;
