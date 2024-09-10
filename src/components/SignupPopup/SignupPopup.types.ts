export interface FormFieldTypes {
  id: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'password' | 'country';
  placeholder: string;
  label: string;
  required: boolean;
}
