import {
  FETCH_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
} from '~constants';
import { UserState } from '~store/types';

export const initialState: UserState = {
  userToken: null,
  message: null,
  loading: false,
  error: null,
};

export const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
    case SIGNUP_REQUEST:
      return { ...state, loading: true };

    case FETCH_USER_SUCCESS:
    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        userToken: action.payload.token,
        user: action.payload.user,
      };

    case FETCH_USER_FAILURE:
    case SIGNUP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
