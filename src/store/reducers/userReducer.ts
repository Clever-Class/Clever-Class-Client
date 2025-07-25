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
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  LOGOUT,
} from '~constants';
import { UserState, ProfileActionTypes } from '~types';

export const initialState: UserState = {
  userToken: null,
  message: null,
  loading: false,
  error: null,
  user: null,
  subscription: null,
};

type UserActionTypes =
  | ProfileActionTypes
  | {
      type: typeof FETCH_USER_REQUEST | typeof SIGNUP_REQUEST;
    }
  | {
      type:
        | typeof FETCH_USER_SUCCESS
        | typeof SIGNUP_SUCCESS
        | typeof LOGIN_SUCCESS
        | typeof SET_USER
        | typeof UPDATE_USER_DATA;
      payload: {
        token?: string;
        user?: UserState['user'];
        subscription?: UserState['subscription'];
      };
    }
  | {
      type: typeof FETCH_USER_FAILURE | typeof SIGNUP_FAILURE;
      payload: string;
    }
  | {
      type: typeof LOGOUT;
    };

export const userReducer = (
  state = initialState,
  action: UserActionTypes,
): UserState => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
    case SIGNUP_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_USER_SUCCESS:
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
    case SET_USER:
    case UPDATE_USER_DATA:
      return {
        ...state,
        loading: false,
        error: null,
        userToken: action.payload.token || state.userToken,
        user: action.payload.user
          ? // If we have a complete user object, use it
            typeof action.payload.user === 'object' &&
            !Array.isArray(action.payload.user) &&
            Object.keys(action.payload.user).length > 1
            ? action.payload.user
            : // Otherwise merge with existing user data
              { ...state.user, ...action.payload.user }
          : state.user,
        subscription: action.payload.subscription || state.subscription,
      };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload.user,
        message: action.payload.message,
      };

    case FETCH_USER_FAILURE:
    case SIGNUP_FAILURE:
    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: action.payload,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};
