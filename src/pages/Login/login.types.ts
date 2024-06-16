import { z } from 'zod';

import { formSchema } from './loginSchema';

export type FormSchemaTypes = z.infer<typeof formSchema>;
