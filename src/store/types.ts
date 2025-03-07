import { SubscriptionStatus, PaymentStatus } from './types/subscriptionTypes';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  country?: string;
  createdAt: string;
  trialCredits?: number;
  firstName?: string;
  lastName?: string;
  subscription?: Subscription;
}

export interface Subscription {
  isPremiumActive: boolean;
  paymentStatus: PaymentStatus;
  updatePaymentMethodUrl: string;
  cancelSubscriptionUrl: string;
  status: SubscriptionStatus;
  subscriptionId: string;
  billingPeriod: {
    starts_at: string;
    ends_at: string;
  };
}

export interface UserState {
  userToken: string | null;
  message: string | null;
  loading: boolean;
  error: string | null;
  user: User | null;
  subscription: Subscription | null;
}

export interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface RootState {
  user: UserState;
  register: RegisterState;
}

export interface EditProfileData {
  firstName: string;
  lastName: string;
  avatar?: File;
}

// ... existing types ...
