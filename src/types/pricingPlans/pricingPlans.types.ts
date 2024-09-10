export interface PricingPlan {
  id: string;
  name: string;
  planType: string;
  price: {
    monthly: number;
    annually: number;
  };
  planId: string;
  credits: string;
  features: string[];
  buttonLabel: string;
  popular?: boolean;
}
