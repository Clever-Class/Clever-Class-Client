import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkSharp } from 'react-icons/io5';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { pricingPlansData } from '../../../data/plansData';
import './PricingPlans.scss';

const PricingPlans = ({ onSignupClick }) => {
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isLoggedIn = !!user;

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
    if (isLoggedIn) {
      // If user is logged in, redirect to dashboard with payment_popup=true and selected plan
      navigate(`/dashboard?payment_popup=true&plan=${planId}`);
    } else if (onSignupClick) {
      // If not logged in, use the provided handler (which should show auth popup)
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
          {pricingPlansData.map((plan) => (
            <div
              key={plan.id}
              className={`plan ${plan.popular ? 'popular' : ''} ${
                plan.id === 'free' ? 'starter' : ''
              }`}
            >
              <div className="plan-header">
                {getIcon(plan.id)}
                <h2>{plan.name}</h2>
                <p className="plan-description">{plan.planType}</p>
              </div>

              <div className="price-container">
                <div className="price">
                  ${isYearly ? plan.price.annually : plan.price.monthly}
                  <span className="price-period">
                    {isYearly ? '/year' : '/month'}
                  </span>
                </div>
              </div>

              <div className="plan-body">
                <div className="plan-features-title">
                  {plan.id === 'free' ? 'Lite includes:' : "What's included:"}
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
                  plan.popular ? 'primary' : 'secondary'
                }`}
                onClick={() => handleSignupClick(plan.planId)}
              >
                {plan.buttonLabel || 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
