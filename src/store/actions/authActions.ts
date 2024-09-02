import Cookies from 'js-cookie';
import { api } from '~api';
import {
  COOKIES_KEYS,
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

      const { data } = await api.cc.post('/auth/signup', userEntryData);
      const message = data.message;
      const user = data.user;
      const countryCode = data.countryCode;
      const token = data.token;

      Cookies.set(COOKIES_KEYS.userToken, token, { expires: 365 });
      Cookies.set(COOKIES_KEYS.userId, user.id, { expires: 365 });

      return { message, countryCode, user, success: true };
    } catch (error: any) {
      const { response } = error;
      dispatch({ type: SIGNUP_FAILURE, payload: response.data.message });
      return { message: response.data.message, success: false };
    }
  };

export const loginUserAction =
  (userCredentials: LoginUserData) => async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const { data } = await api.cc.post('/auth/login', userCredentials);

      const message = data.message;
      const userToken = data.token;

      Cookies.set(COOKIES_KEYS.userToken, userToken, { expires: 365 });
      Cookies.set(COOKIES_KEYS.userId, data.user.id, { expires: 365 });

      // saving the user token to cookies
      dispatch({ type: LOGIN_SUCCESS, payload: userToken });

      return message;
    } catch (error: any) {
      const { response } = error;
      dispatch({ type: LOGIN_FAILURE, payload: response.data.message });
      throw response.data.message;
    }
  };
