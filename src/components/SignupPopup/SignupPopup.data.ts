import { FormFieldTypes } from './SignupPopup.types';

export const SIGNUP_FORM_FIELDS: FormFieldTypes[] = [
  {
    id: 'name',
    name: 'name',
    type: 'text',
    placeholder: 'Enter your name',
    label: 'Name',
    required: true,
  },
  {
    id: 'email',
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
    label: 'Email',
    required: true,
  },
  // {
  //   id: 'phone',
  //   name: 'phone',
  //   type: 'tel',
  //   placeholder: 'Enter your phone number',
  //   label: 'Phone',
  //   required: true,
  // },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    label: 'Password',
    required: true,
  },
];
