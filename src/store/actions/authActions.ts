import Cookies from 'js-cookie';
import { api } from '~api';
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LoginUserData,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SignupUserData,
} from '~constants';
import { AppDispatch } from '~store';

export const signupUserAction =
  (userEntryData: SignupUserData) => async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: SIGNUP_REQUEST });

      const { data } = await api.ccServer.post('/auth/signup', userEntryData);
      const message = data.message;
      const user = data.user;
      const token = data.token;
      const countryCode = data.countryCode;

      dispatch({ type: SIGNUP_SUCCESS, payload: { token, user, message } });

      return { message, token, countryCode, user, success: true };
    } catch (error: any) {
      const { response } = error;

      dispatch({
        type: SIGNUP_FAILURE,
        payload: response?.data?.message || 'Could Not Create Account',
      });
      throw {
        message: response?.data?.message || 'Could Not Create Account',
        success: false,
      };
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
