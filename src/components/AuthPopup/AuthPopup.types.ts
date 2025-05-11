export interface FormFieldTypes {
  id: string;
  name: 'name' | 'email' | 'password' | 'country';
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  required?: boolean;
}

export interface AuthFormFields {
  login: FormFieldTypes[];
  signup: FormFieldTypes[];
}
