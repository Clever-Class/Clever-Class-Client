import { api } from '~api';
import { SIGNUP_FAILURE, SIGNUP_REQUEST, SignupUserData } from '~constants';
import { AppDispatch } from '~store';

export const signupUserAction =
  (userEntryData: SignupUserData) => async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: SIGNUP_REQUEST });

      const { data } = await api.ccServer.post('/auth/signup', userEntryData);
      console.log(data);
      const message = data.message;

      return message;
    } catch (error: any) {
      const { response } = error;
      dispatch({ type: SIGNUP_FAILURE, payload: response.data.message });
    }
  };
