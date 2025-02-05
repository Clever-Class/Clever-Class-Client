export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const SET_USER = 'SET_USER';

export interface LoginPendingAction {
  type: typeof LOGIN_REQUEST;
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: string;
}

export interface LoginErrorAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

export type UserActionTypes =
  | LoginPendingAction
  | LoginSuccessAction
  | LoginErrorAction;

export interface SignupUserData {
  name: string;
  email: string;
  password: string;
  selectedPackageId: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}
