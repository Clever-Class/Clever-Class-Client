import { z } from 'zod';

import { formSchema } from './signupSchema';

export type FormSchemaTypes = z.infer<typeof formSchema>;
