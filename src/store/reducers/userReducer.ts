import {
  FETCH_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
} from '~constants';
import { UserState } from '~store/types';

const initialState: UserState = {
  userToken: null,
  message: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
    case SIGNUP_REQUEST:
      return { ...state, loading: true };

    case FETCH_USER_SUCCESS:
      return { ...state, loading: false, userToken: action.payload };

    case FETCH_USER_FAILURE:
    case SIGNUP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default userReducer;
