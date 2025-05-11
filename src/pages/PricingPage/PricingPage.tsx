import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Navbar, AuthPopup } from '~components/index';

import './PricingPage.scss';
import Footer from '~components/Footer';
import PricingPlans from '~components/LandingPageComponent/PricingPlans/PricingPlans';

export const PricingPage = () => {
  const dispatch = useDispatch();
  const [authPopup, setAuthPopup] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({
    isOpen: false,
    mode: 'signup',
  });

  const handlePricingSignupClick = (planId: string) => {
    dispatch({ type: 'SELECT_PRICING_PLAN', payload: planId });
    setAuthPopup({ isOpen: true, mode: 'signup' });
  };

  const handleFreeTrial = () => {
    setAuthPopup({ isOpen: true, mode: 'signup' });
  };

  const handleLoginClick = () => {
    setAuthPopup({ isOpen: true, mode: 'login' });
  };

  return (
    <div className="pricing-page">
      <Navbar onSignupClick={handleFreeTrial} onLoginClick={handleLoginClick} />

      {/* Auth Popup */}
      {authPopup.isOpen && (
        <AuthPopup
          onClose={() => setAuthPopup({ isOpen: false, mode: 'signup' })}
          mode={authPopup.mode}
        />
      )}

      <PricingPlans onSignupClick={handlePricingSignupClick} />

      <Footer />
    </div>
  );
};
