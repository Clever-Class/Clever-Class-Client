export * from './pricingPlans/pricingPlans.types';
export * from './user/user.types.ts';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  country?: string;
  trialCredits?: number;
}

export interface UserState {
  userToken: string | null;
  message: string | null;
  loading: boolean;
  error: string | null;
  user: User | null;
  subscription: any | null; // TODO: Add proper subscription type
}

export interface RegisterState {
  loading: boolean;
  error: string | null;
  message: string | null;
}

export interface RootState {
  user: UserState;
  register: RegisterState;
}

export interface UpdateProfileData {
  name?: string;
  avatar?: File;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: User;
}

export type ProfileActionTypes =
  | { type: 'UPDATE_PROFILE_REQUEST' }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: { user: User; message: string } }
  | { type: 'UPDATE_PROFILE_FAILURE'; payload: string };
