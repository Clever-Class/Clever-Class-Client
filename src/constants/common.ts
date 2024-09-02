export enum AppRoutes {
  Homepage = '/',
  Dashboard = '/dashboard',
  Login = '/login',
  Signup = '/signup',
  ForgotPassword = '/forgot-password',
  ResetPassword = '/reset-password/:resetToken',
  Payment = '/payment',
}

export const COOKIES_KEYS = {
  userToken: 'cc_user_token',
  userId: 'cc_user_id',
};

export const EXTENSION_ID = 'extension_id';
