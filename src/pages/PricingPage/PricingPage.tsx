import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Navbar, SignupPopup } from '~components/index';
import { PricingPlans } from '~components/LandingPageComponent/PricingPlans/PricingPlans';

import './PricingPage.scss';
import Footer from '~components/Footer';

export const PricingPage = () => {
  const dispatch = useDispatch();
  const [signupPopup, setSignupPopup] = useState<boolean>(false);

  const handlePricingSignupClick = (planId: string) => {
    dispatch({ type: 'SELECT_PRICING_PLAN', payload: planId });
    setSignupPopup(true);
  };

  const handleFreeTrial = () => {
    setSignupPopup(true);
  };

  return (
    <div className="pricing-page">
      <Navbar onSignupClick={handleFreeTrial} />

      {/* Signup Popup */}
      {signupPopup && <SignupPopup onClose={() => setSignupPopup(false)} />}

      <PricingPlans onSignupClick={handlePricingSignupClick} />

      <Footer />
    </div>
  );
};
