import React, { useState } from 'react';
import { pricingPlansData } from '~/data';
import './PricingPlans.scss';

type PriceDuration = 'monthly' | 'annually';

interface PricingPlansProps {
  onSignupClick: (planId: string) => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({
  onSignupClick,
}) => {
  const [selectedDuration, setSelectedDuration] =
    useState<PriceDuration>('monthly');

  const handleDurationClick = (duration: PriceDuration) => {
    setSelectedDuration(duration);
  };

  return (
    <div className="pricing-plans-wrapper">
      <div className="pricing-plans">
        <div className="background-pattern">
          <h1>Choose Your Right Plans</h1>
          <p className="subtitle">
            Select from best plans, ensuring a perfect match. Need more or less?
            <br />
            Customize your subscription for a seamless fit!
          </p>
          <div className="toggle-container">
            <button
              className={`duration-button ${
                selectedDuration === 'monthly' ? 'active' : ''
              }`}
              onClick={() => handleDurationClick('monthly')}
            >
              MONTHLY
            </button>
            <button
              className={`duration-button ${
                selectedDuration === 'annually' ? 'active' : ''
              }`}
              onClick={() => handleDurationClick('annually')}
            >
              YEARLY
            </button>
          </div>
          <div className="plans-container">
            {pricingPlansData.map((plan) => (
              <div
                key={plan.id}
                className={`plan ${plan.id} ${plan.popular ? 'popular' : ''}`}
              >
                <div className="plan-header">
                  <h2>{plan.name}</h2>
                  <p className="plan-description">{plan.planType}</p>
                </div>
                <div className="price-container">
                  <h3 className="price">
                    ${plan.price[selectedDuration]}
                    <span className="price-period">per seat/month</span>
                  </h3>
                </div>
                <div className="plan-body">
                  <p className="plan-features-title">
                    {plan.id === 'free'
                      ? 'Lite includes:'
                      : plan.id === 'starter'
                      ? 'Everything in pro plus:'
                      : 'Everything in pro plus:'}
                  </p>
                  <ul className="features-list">
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <span className="feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`sign-up-button ${
                    plan.popular ? 'primary' : 'secondary'
                  }`}
                  onClick={() => onSignupClick(plan.planId)}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
