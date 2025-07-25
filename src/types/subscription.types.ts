export interface Subscription {
  status: SubscriptionStatus;
  isPremiumActive: boolean;
  subscriptionId: string;
  paymentStatus: PaymentStatus;
  updatePaymentMethodUrl: string;
  cancelSubscriptionUrl: string;
  billingPeriod: {
    starts_at: string;
    ends_at: string;
  };
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  NOT_STARTED = 'not_started',
  PAUSED = 'paused',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
}

export enum PaymentStatus {
  PAID = 'paid',
  FREE = 'free',
  OVERDUE = 'overdue',
  FAILED = 'failed',
}
