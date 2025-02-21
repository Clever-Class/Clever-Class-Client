import {
  FETCH_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  LOGIN_SUCCESS,
  SET_USER,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  UPDATE_USER_DATA,
} from '~constants';
import { UserState } from '~store/types';

export const initialState: UserState = {
  userToken: null,
  message: null,
  loading: false,
  error: null,
  user: null,
  subscription: null,
};

export const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
    case SIGNUP_REQUEST:
      return { ...state, loading: true };

    case FETCH_USER_SUCCESS:
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
    case SET_USER:
    case UPDATE_USER_DATA:
      return {
        ...state,
        loading: false,
        userToken: action.payload.token || state.userToken,
        user: action.payload.user || state.user,
        subscription: action.payload.subscription || state.subscription,
      };

    case FETCH_USER_FAILURE:
    case SIGNUP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
