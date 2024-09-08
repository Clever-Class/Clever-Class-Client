export interface FormFieldTypes {
  id: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'password';
  placeholder: string;
  label: string;
  required: boolean;
}
