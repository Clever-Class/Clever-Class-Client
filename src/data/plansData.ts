// src/data/plansData.ts

import { PricingPlan } from '~types';

export const pricingPlansData: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    planType: 'Pay month by month',
    price: { 
      monthly: 19, 
      semester: 19, // Not used but required by type
      annually: 19 // Not used but required by type
    },
    credits: '',
    features: [
      'AI Chatbot assistance',
      '50 quiz generations/month',
      'Basic study analytics',
      'Screenshot to solution',
      'Standard support',
    ],
    planId: import.meta.env.VITE_PLAN_ID_MONTHLY || 'monthly-plan',
    buttonLabel: 'Start Monthly',
    savings: {
      semester: 'Save nothing',
      annually: 'Save nothing'
    }
  },
  {
    id: 'semester',
    name: 'Semester',
    planType: 'Best value for students',
    price: { 
      monthly: 45, // Not used but required by type
      semester: 45, // 3 months
      annually: 45 // Not used but required by type
    },
    credits: '',
    features: [
      'Everything in Monthly',
      'Unlimited quiz generation',
      'Advanced AI tutoring',
      'Lecture summarizer',
      'Voice interactions',
      'Progress tracking',
      'Quick notes feature',
      'Priority support',
    ],
    planId: import.meta.env.VITE_PLAN_ID_SEMESTER || 'semester-plan',
    buttonLabel: 'Start Semester',
    popular: true,
    recommended: true,
    badge: 'Best Value',
    savings: {
      semester: 'Save 21%',
      annually: 'Save 21%'
    }
  },
  {
    id: 'yearly',
    name: 'Yearly',
    planType: 'Maximum savings',
    price: { 
      monthly: 168, // Not used but required by type
      semester: 168, // Not used but required by type
      annually: 168 // 12 months
    },
    credits: '',
    features: [
      'Everything in Semester',
      'Chrome extension access',
      'Advanced study analytics',
      'Export & sharing features',
      'Custom quiz templates',
      'Image problem solving',
      'Email & SMS reminders',
      '24/7 priority support',
      'Early access to new features',
    ],
    planId: import.meta.env.VITE_PLAN_ID_YEARLY || 'yearly-plan',
    buttonLabel: 'Start Yearly',
    savings: {
      semester: 'Save 26%',
      annually: 'Save 26%'
    }
  },
];
