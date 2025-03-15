import { UserState } from '~/types/user.types';

// Re-export user types for consistency
export type { User, UserState, SubscriptionState } from '~/types/user.types';
export type { Subscription } from '~/types/subscription.types';
export { SubscriptionStatus, PaymentStatus } from '~/types/subscription.types';

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  selectedPackage?: string | null;
  message: string | null;
}

export interface RootState {
  user: UserState;
  auth: AuthState;
  register: RegisterState;
}

export interface EditProfileData {
  firstName: string;
  lastName: string;
  avatar?: File;
}
