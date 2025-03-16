// src/data/plansData.ts

import { PricingPlan } from '~types';

export const pricingPlansData: PricingPlan[] = [
  {
    id: 'free',
    name: 'Lite',
    planType: 'Toolset for hard players',
    price: { monthly: 9, annually: 7 },
    credits: '',
    features: [
      'Customer Support 24/7',
      'Email & SMS reminder',
      'CMS Integration',
    ],
    planId: import.meta.env.VITE_PLAN_ID_FREE || 'lite-plan',
    buttonLabel: 'Get Started',
  },
  {
    id: 'starter',
    name: 'Pro',
    planType: 'Best for professionals',
    price: { monthly: 19, annually: 16 },
    credits: '',
    features: [
      'Templates library',
      'Artificial Intelligence',
      '100+ integrations',
      'Advance analysis',
    ],
    planId: import.meta.env.VITE_PLAN_ID_STARTER || 'pro-plan',
    buttonLabel: 'Get Started',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Ultimate',
    planType: 'Toolset for hard players',
    price: { monthly: 35, annually: 30 },
    credits: '',
    features: [
      'Marketing tools & automations',
      'Artificial Intelligence',
      'Dedicated assistant',
      'Daily performance reports',
    ],
    planId: import.meta.env.VITE_PLAN_ID_PRO || 'ultimate-plan',
    buttonLabel: 'Get Started',
  },
];
