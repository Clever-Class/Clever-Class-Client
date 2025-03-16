import React, { useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { pricingPlans } from '../../../data/pricingPlans';
import './PricingPlans.scss';

const PricingPlans = ({ onSignupClick }) => {
  const [isYearly, setIsYearly] = useState(false);

  const toggleBilling = (value) => {
    setIsYearly(value);
  };

  const getIcon = (planId) => {
    switch (planId) {
      case 'lite':
        return <HiOutlineLightBulb className="plan-icon" />;
      default:
        return null;
    }
  };

  const handleSignupClick = (planId) => {
    if (onSignupClick) {
      onSignupClick(planId);
    }
  };

  return (
    <div className="pricing-plans-wrapper">
      <div className="pricing-plans">
        <div className="title-container">
          <h1>
            <span>Choose Your Right </span>
            <span className="highlight">Plans</span>
          </h1>
          <p className="subtitle">
            Select from best plans, ensuring a perfect match. Need more or less?
            Customize your subscription for a seamless fit!
          </p>
        </div>

        <div className="toggle-container">
          <div className={`slider ${isYearly ? 'yearly' : ''}`}></div>
          <button
            className={`duration-button ${!isYearly ? 'active' : ''}`}
            onClick={() => toggleBilling(false)}
          >
            Monthly
          </button>
          <button
            className={`duration-button ${isYearly ? 'active' : ''}`}
            onClick={() => toggleBilling(true)}
          >
            Yearly
          </button>
        </div>

        <div className="plans-container">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`plan ${plan.id === 'pro' ? 'popular' : ''} ${
                plan.id === 'lite' ? 'starter' : ''
              }`}
            >
              <div className="plan-header">
                {getIcon(plan.id)}
                <h2>{plan.name}</h2>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="price-container">
                <div className="price">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  <span className="price-period">
                    {plan.id === 'lite'
                      ? ' per seat/month'
                      : isYearly
                      ? '/year'
                      : '/month'}
                  </span>
                </div>
              </div>

              <div className="plan-body">
                <div className="plan-features-title">
                  {plan.id === 'lite' ? 'Light includes:' : "What's included:"}
                </div>
                <ul className="features-list">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-icon">
                        <IoCheckmarkSharp />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`sign-up-button ${
                  plan.id === 'pro' ? 'primary' : 'secondary'
                }`}
                onClick={() => handleSignupClick(plan.id)}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
