import { useState } from 'react';
import { useSelector } from 'react-redux';
import { forgotPassword, resetPassword } from '~api';
import { RootState } from '~store';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { userToken, user } = useSelector((state: RootState) => state.user);

  // The isAuthenticated variable is created to check if the user is authenticated
  const isAuthenticated = Boolean(userToken);

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

  // The handleResetPassword function is created to handle the reset password functionality
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

  // The user variable is created to store the user data
  return {
    loading,
    error,
    handleForgotPassword,
    handleResetPassword,
    isAuthenticated,
    user,
  };
};
