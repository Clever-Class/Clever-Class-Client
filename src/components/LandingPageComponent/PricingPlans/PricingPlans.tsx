import React from 'react';
import './PricingPlans.scss';

const subscriptionDuration = ['Monthly', 'Annually'];

export const PricingPlans = () => {
  const [selectedDuration, setSelectedDuration] = React.useState('Monthly');

  const handleDurationClick = (duration: string) => {
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
                onClick={() => handleDurationClick(duration)}
              >
                {duration}
              </button>
            ))}
            {/* <span className="save-tag">Save 20%</span> */}

            {/* <span className="save-tag">Save 20%</span> */}
          </div>
          <div className="plans-container">
            <div className="plan free">
              <div className="plan-body">
                <h2>Free</h2>
                <span className="plan-type">INDIVIDUAL PLAN</span>
                <h3 className="price">$0</h3>
                <p className="credits">50 CREDITS / MONTH | 5 OR 50</p>
                <ul>
                  <li>2 Actives Sequence</li>
                  <li>Basic multichannel outreach (Email, call)</li>
                  <li>Basic search filter</li>
                  <li>Enrichment hub (.csv only)</li>
                </ul>
              </div>
              <button className="sign-up">Sign up</button>
            </div>
            <div className="plan starter">
              <div className="plan-body">
                <span className="popular-tag">Most Popular</span>
                <h2>Starter</h2>
                <span className="plan-type">INDIVIDUAL PLAN</span>
                <h3 className="price">
                  $59<span>/user/month</span>
                </h3>
                <p className="credits">750 CREDITS / MONTH | 75 OR 750</p>
                <ul>
                  <li>Everything in Free</li>
                  <li>Unlimited active sequence</li>
                  <li>
                    Advanced multichannel outreach (LinkedIn, Email, call)
                  </li>
                  <li>Advanced search filter</li>
                  <li>CRM synchronization</li>
                  <li>Enrichment hub (LinkedIn, Search...)</li>
                </ul>
              </div>
              <button className="sign-up">Sign up</button>
            </div>
            <div className="plan custom">
              <div className="plan-body">
                <h2>Custom</h2>
                <span className="plan-type">TEAM PLAN</span>
                <h3 className="price">
                  Start at $4.5k<span>/year</span>
                </h3>
                <p className="credits">
                  24K CREDITS / YEAR / USER | 24K AND FREE
                </p>
                <ul>
                  <li>Everything in Starter</li>
                  <li>Team workspace</li>
                  <li>Manager dashboard</li>
                  <li>Dedicated account manager</li>
                  <li>3 License Onwards</li>
                </ul>
              </div>
              <button className="sign-up">Talk to Sales</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
