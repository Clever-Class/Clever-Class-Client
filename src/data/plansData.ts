// src/data/plansData.ts

import { PricingPlan } from '~types';

export const pricingPlansData: PricingPlan[] = [
  {
    id: 'free',
    name: 'Freemium',
    planType: 'FREEMIUM PLAN',
    price: { monthly: 0, annually: 0 },
    credits: '5 CREDITS / DAY',
    features: [
      '2 Active Sequences: Run two concurrent outreach campaigns',
      'Basic multichannel outreach: Connect via Email and Phone calls',
      'Basic search filter: Find prospects with essential search criteria',
      'Enrichment hub (.csv only): Import and enrich data from CSV files',
    ],
    planId: import.meta.env.VITE_PLAN_ID_FREE,
    buttonLabel: 'Sign Up',
  },
  {
    id: 'starter',
    name: 'Starter',
    planType: 'STARTER PLAN',
    price: { monthly: 12.99, annually: 10.99 },
    credits: '750 CREDITS / MONTH | 75 OR 750',
    features: [
      'Everything in Free',
      'Unlimited active sequence',
      'Advanced multichannel outreach (LinkedIn, Email, call)',
      'Advanced search filter',
      'CRM synchronization',
      'Enrichment hub (LinkedIn, Search...)',
    ],
    planId: import.meta.env.VITE_PLAN_ID_STARTER,
    buttonLabel: 'Sign Up',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    planType: 'PRO PLAN',
    price: {
      monthly: 19.99,
      annually: 17.99,
    },
    credits: '24K CREDITS / YEAR / USER | 24K AND FREE',
    features: [
      'Everything in Starter',
      'Team workspace',
      'Manager dashboard',
      'Dedicated account manager',
      '3 License Onwards',
    ],
    planId: import.meta.env.VITE_PLAN_ID_PRO,
    buttonLabel: 'Sign Up',
  },
];
