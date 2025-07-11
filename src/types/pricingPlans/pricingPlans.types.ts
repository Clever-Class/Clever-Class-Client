export interface PricingPlan {
  id: string;
  name: string;
  planType: string;
  price: {
    monthly: number;
    semester: number; // 3 months
    annually: number;
  };
  planId: string;
  credits: string;
  features: string[];
  buttonLabel: string;
  popular?: boolean;
  recommended?: boolean; // New field to highlight semester plan
  badge?: string; // For displaying badges like "Most Popular", "Best Value", etc.
  savings?: {
    semester: string; // e.g., "Save 20%"
    annually: string; // e.g., "Save 30%"
  };
}
