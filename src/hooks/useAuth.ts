import { useState } from 'react';
import { forgotPassword, resetPassword } from '~api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The handleForgotPassword function is created to handle the forgot password functionality
  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await forgotPassword(email);
      return response.message;
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (resetToken: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await resetPassword(resetToken, password);
      console.log(response, 'response');
      return response.message;
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleForgotPassword, handleResetPassword };
};
