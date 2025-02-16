import { User } from 'firebase/auth';
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
  LOGOUT,
  UPDATE_USER_DATA,
} from '~constants';
import { AppDispatch } from '~store';
import { Dispatch } from 'redux';

export const signupUserAction =
  (userEntryData: SignupUserData) => async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: SIGNUP_REQUEST });

      const { data } = await api.ccServer.post('/auth/signup', userEntryData);
      const message = data.message;
      const user = data.user;
      const token = data.token;
      const subscription = data.subscription;
      const countryCode = data.countryCode;
      console.log('Redirecting to dashboard with the following data:...', {
        user,
        token,
      });

      dispatch({
        type: SIGNUP_SUCCESS,
        payload: { token, user, subscription, message },
      });

      Cookies.set('userToken', token);

      return { message, token, user, countryCode, success: true };
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

export const signupWithGoogleAction =
  (googleUser: User, selectedPackageId: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: SIGNUP_REQUEST });
      const userAccessToken = await googleUser.getIdToken();

      // calling to the server to signup or login with google
      const { data } = await api.ccServer.post('/auth/login-oauth', {
        accessToken: userAccessToken,
        selectedPackageId,
      });

      // extracting the data from the response
      const token = data.token;
      const user = data.user;
      const message = data.message;

      // saving the user token to cookies
      Cookies.set('userToken', token);

      // redirecting to the dashboard
      window.location.href = '/dashboard?payment_popup=true';

      // dispatching the success action
      return dispatch({
        type: SIGNUP_SUCCESS,
        payload: {
          message,
          token,
          user,
        },
      });
    } catch (error: any) {
      const { response } = error;
      dispatch({ type: SIGNUP_FAILURE, payload: response.data.message });
      throw response.data.message;
    }
  };

export const fetchUserData = () => {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await api.ccServer.get('/auth/me');

      dispatch({
        type: UPDATE_USER_DATA,
        payload: {
          user: data.user,
          subscription: data.subscription,
        },
      });

      return data;
    } catch (error) {
      // If the token is invalid or expired, logout the user
      if ((error as any)?.response?.status === 401) {
        dispatch({ type: LOGOUT });
        Cookies.remove('userToken');
      }
      throw error;
    }
  };
};

export const logout = () => {
  return (dispatch: Dispatch) => {
    Cookies.remove('userToken');
    dispatch({ type: LOGOUT });
  };
};
