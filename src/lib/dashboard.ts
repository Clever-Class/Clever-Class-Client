import { api } from '~api';

export const fetchUserDataAfterPayment = async () => {
  try {
    const { data } = await api.ccServer.get(`/user/profile/me`);
    return data.user;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error fetching user data',
    );
  }
};
