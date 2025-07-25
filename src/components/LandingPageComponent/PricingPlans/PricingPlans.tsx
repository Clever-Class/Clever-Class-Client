import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoCheckmarkSharp } from 'react-icons/io5';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineSparkles } from 'react-icons/hi';
import { pricingPlansData } from '../../../data/plansData';
import { RootState } from '~store/types';
import './PricingPlans.scss';

interface PricingPlansProps {
  onSignupClick: (planId: string) => void;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ onSignupClick }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const getIcon = useCallback((planId: string) => {
    switch (planId) {
      case 'monthly':
        return <HiOutlineCalendar className="plan-icon" />;
      case 'semester':
        return <HiOutlineSparkles className="plan-icon" />;
      case 'yearly':
        return <HiOutlineClock className="plan-icon" />;
      default:
        return null;
    }
  }, []);

  const getPriceDisplay = useCallback((plan: any) => {
    switch (plan.id) {
      case 'monthly':
        return { amount: plan.price.monthly, period: '/month' };
      case 'semester':
        return { amount: plan.price.semester, period: '/3 months' };
      case 'yearly':
        return { amount: plan.price.annually, period: '/year' };
      default:
        return { amount: plan.price.monthly, period: '/month' };
    }
  }, []);

  const handleSignupClick = useCallback((planId: string, billingType: string) => {
    if (isLoggedIn) {
      navigate(`/dashboard?payment_popup=true&plan=${planId}&billing=${billingType}`);
    } else if (onSignupClick) {
      onSignupClick(planId);
    }
  }, [isLoggedIn, navigate, onSignupClick]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  }), []);

  const cardVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }), []);

  return (
    <div className="pricing-plans-wrapper">
      <motion.div 
        className="pricing-plans"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <motion.div className="title-container" variants={cardVariants}>
          <h1>
            <span>Choose Your </span>
            <span className="highlight">Perfect Plan</span>
          </h1>
          <p className="subtitle">
            Start your learning journey with flexible pricing. Save more with longer commitments!
          </p>
        </motion.div>

        <motion.div className="plans-container" variants={containerVariants}>
          {pricingPlansData.map((plan, index) => {
            const priceInfo = getPriceDisplay(plan);
            
            return (
              <motion.div
                key={plan.id}
                className={`plan ${plan.popular ? 'popular' : ''} ${
                  plan.recommended ? 'recommended' : ''
                }`}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.badge && plan.recommended && (
                  <motion.div 
                    className="plan-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {plan.badge}
                  </motion.div>
                )}

                <div className="plan-header">
                  {getIcon(plan.id)}
                  <h2>{plan.name}</h2>
                  <p className="plan-description">{plan.planType}</p>
                </div>

                <div className="price-container">
                  <div className="price">
                    ${priceInfo.amount}
                    <span className="price-period">{priceInfo.period}</span>
                  </div>
                  {plan.savings && (
                    <motion.div 
                      className={`savings-badge ${plan.savings.semester === 'Save nothing' ? 'no-savings' : ''}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {plan.savings.semester}
                    </motion.div>
                  )}
                </div>

                <div className="plan-body">
                  <div className="plan-features-title">
                    What's included:
                  </div>
                  <ul className="features-list">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + featureIndex * 0.05 }}
                      >
                        <span className="feature-icon">
                          <IoCheckmarkSharp />
                        </span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  className={`sign-up-button ${
                    plan.popular || plan.recommended ? 'primary' : 'secondary'
                  }`}
                  onClick={() => handleSignupClick(plan.planId, plan.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {plan.buttonLabel || 'Get Started'}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PricingPlans;
