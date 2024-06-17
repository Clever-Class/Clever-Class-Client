import { SIGNUP_FAILURE, SIGNUP_REQUEST } from '~constants';
import { AppDispatch } from '~store';

export const signupUserAction =
  (userEntryData: any) => async (dispatch: AppDispatch) => {
    try {
      console.log(userEntryData);
      dispatch({ type: SIGNUP_REQUEST });
    } catch (error: any) {
      dispatch({ type: SIGNUP_FAILURE });
    }
  };
