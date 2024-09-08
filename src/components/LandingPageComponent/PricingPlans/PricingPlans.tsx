import React from 'react';
import { pricingPlansData } from '~/data';

import './PricingPlans.scss';

const subscriptionDuration = ['monthly', 'annually'];

type PriceDuration = 'monthly' | 'annually';

export const PricingPlans = () => {
  const [selectedDuration, setSelectedDuration] =
    React.useState<PriceDuration>('monthly');

  const handleDurationClick = (duration: PriceDuration) => {
    setSelectedDuration(duration);
  };

  return (
    <div className="pricing-plans-wrapper">
      <div className="pricing-plans">
        <div className="background-pattern">
          <h1>Pricing & Plans</h1>
          <div className="toggle-container">
            {subscriptionDuration.map((duration, index) => (
              <button
                key={index}
                className={`duration-button ${
                  selectedDuration === duration ? 'active' : ''
                }`}
                onClick={() => handleDurationClick(duration as PriceDuration)}
              >
                {duration.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="plans-container">
            {pricingPlansData.map((plan) => (
              <div key={plan.id} className={`plan ${plan.id}`}>
                <div className="plan-body">
                  {plan.popular && (
                    <span className="popular-tag">Most Popular</span>
                  )}
                  <h2>{plan.name}</h2>
                  <span className="plan-type">{plan.planType}</span>
                  <h3 className="price">
                    ${plan.price[selectedDuration]}
                    <span>/ {selectedDuration.toUpperCase()}</span>
                  </h3>
                  <p className="credits">{plan.credits}</p>
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <button className="sign-up">{plan.buttonLabel}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
