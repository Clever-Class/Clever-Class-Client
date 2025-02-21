export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  NOT_STARTED = 'not_started',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

interface BillingPeriod {
  ends_at: string | null;
  starts_at: string | null;
}

interface Subscription {
  billingPeriod: BillingPeriod;
  status: SubscriptionStatus;
  subscriptionId: string | null;
  _id: string;
}

export interface User {
  id: string;
  email: string;
  country: string;
  name: string;
  trialCredits: number;
  createdAt: string;
  subscription: Subscription;
  selectedPackageId: string | null;
}
