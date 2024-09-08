// src/data/plansData.ts

import { PricingPlan } from '~types';

export const pricingPlansData: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    planType: 'INDIVIDUAL PLAN',
    price: { monthly: 0, annually: 0 },
    credits: '50 CREDITS / MONTH | 5 OR 50',
    features: [
      '2 Actives Sequence',
      'Basic multichannel outreach (Email, call)',
      'Basic search filter',
      'Enrichment hub (.csv only)',
    ],
    buttonLabel: 'Sign up',
  },
  {
    id: 'starter',
    name: 'Starter',
    planType: 'INDIVIDUAL PLAN',
    price: { monthly: 7.99, annually: 5.99 },
    credits: '750 CREDITS / MONTH | 75 OR 750',
    features: [
      'Everything in Free',
      'Unlimited active sequence',
      'Advanced multichannel outreach (LinkedIn, Email, call)',
      'Advanced search filter',
      'CRM synchronization',
      'Enrichment hub (LinkedIn, Search...)',
    ],
    buttonLabel: 'Sign up',
    popular: true,
  },
  {
    id: 'custom',
    name: 'Custom',
    planType: 'TEAM PLAN',
    price: {
      monthly: 12.99,
      annually: 10.99,
    },
    credits: '24K CREDITS / YEAR / USER | 24K AND FREE',
    features: [
      'Everything in Starter',
      'Team workspace',
      'Manager dashboard',
      'Dedicated account manager',
      '3 License Onwards',
    ],
    buttonLabel: 'Talk to Sales',
  },
];
