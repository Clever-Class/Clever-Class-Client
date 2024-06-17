import Cookies from 'js-cookie';
import { api } from '~api';
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LoginUserData,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SignupUserData,
} from '~constants';
import { AppDispatch } from '~store';

export const signupUserAction =
  (userEntryData: SignupUserData) => async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: SIGNUP_REQUEST });

      const { data } = await api.ccServer.post('/auth/signup', userEntryData);
      const message = data.message;

      return message;
    } catch (error: any) {
      const { response } = error;
      dispatch({ type: SIGNUP_FAILURE, payload: response.data.message });
      return response.data.message;
    }
  };

export const loginUserAction =
  (userCredentials: LoginUserData) => async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const { data } = await api.ccServer.post('/auth/login', userCredentials);

      const message = data.message;
      const userToken = data.token;

      Cookies.set('userToken', userToken, { expires: 7 });

      // saving the user token to cookies
      dispatch({ type: LOGIN_SUCCESS, payload: userToken });

      return message;
    } catch (error: any) {
      const { response } = error;
      dispatch({ type: LOGIN_FAILURE, payload: response.data.message });
      throw response.data.message;
    }
  };
