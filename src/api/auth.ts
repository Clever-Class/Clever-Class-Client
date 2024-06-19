import { api } from './api';

// The forgotPassword function is created to send a request to the server to reset the password
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.ccServer.post('/auth/forgot-password', {
      email,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error occurred');
  }
};

// The resetPassword function is created to send a request to the server to reset the password
export const resetPassword = async (resetToken: string, password: string) => {
  try {
    const response = await api.ccServer.post(
      `/auth/reset-password/${resetToken}`,
      {
        password,
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error occurred');
  }
};
