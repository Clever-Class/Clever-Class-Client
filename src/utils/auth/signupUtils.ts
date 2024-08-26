import { UseFormSetError } from 'react-hook-form';

export const validatePassword = (
  values: {
    password: string;
    confirmPassword: string;
  },
  setError: UseFormSetError<{
    confirmPassword: string;
  }>,
) => {
  if (values.password !== values.confirmPassword) {
    setError('confirmPassword', {
      type: 'manual',
      message: 'Passwords do not match',
    });
    return false;
  }

  return true;
};
