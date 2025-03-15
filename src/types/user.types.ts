export interface User {
  id: string;
  email: string;
  name?: string;
  country?: string;
  trialCredits?: number;
  selectedPackageId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  subscription: SubscriptionState | null;
}

export interface SubscriptionState {
  status: 'active' | 'canceled' | 'past_due' | 'pending' | 'not_started';
  billingPeriod?: {
    starts_at: string;
    ends_at: string;
  };
  updatePaymentMethodUrl?: string;
}
