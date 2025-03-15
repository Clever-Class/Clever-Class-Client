import { api } from '~api';
import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from '~constants';
import { AppDispatch } from '~store';

export const updateProfileAction = (data: {
  name?: string;
  avatar?: string;
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    try {
      const response = await api.ccServer.patch('/user/profile/me', data);

      if (response.data.success) {
        dispatch({
          type: UPDATE_PROFILE_SUCCESS,
          payload: {
            user: response.data.user,
            message: response.data.message,
          },
        });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      dispatch({
        type: UPDATE_PROFILE_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
      throw error.response?.data?.message || error.message;
    }
  };
};
