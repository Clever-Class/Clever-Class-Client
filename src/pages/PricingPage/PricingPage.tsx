import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Navbar, AuthPopup } from '~components/index';
import { Payment } from '~components/Payment';
import PricingPlans from '~components/LandingPageComponent/PricingPlans';

import './PricingPage.scss';
import Footer from '~components/Footer/Footer';
import { RootState } from '~store/types';
import { usePaymentPopup } from '~/hooks';

export const PricingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const isLoggedIn = !!user;

  const {
    openPaymentPopup,
    closePaymentPopup,
    isOpen: paymentPopupOpen,
    paymentPopupProps,
  } = usePaymentPopup();

  const [authPopup, setAuthPopup] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({
    isOpen: false,
    mode: 'signup',
  });

  const handlePricingSignupClick = (planId: string) => {
    if (isLoggedIn) {
      // If user is logged in, show payment popup
      openPaymentPopup(planId);
    } else {
      // If user is not logged in, save the selected plan and show auth popup
      dispatch({ type: 'SELECT_PRICING_PLAN', payload: planId });
      setAuthPopup({ isOpen: true, mode: 'signup' });
    }
  };

  const handleFreeTrial = () => {
    if (isLoggedIn) {
      // If logged in, navigate to dashboard
      navigate('/dashboard');
    } else {
      setAuthPopup({ isOpen: true, mode: 'signup' });
    }
  };

  const handleLoginClick = () => {
    setAuthPopup({ isOpen: true, mode: 'login' });
  };

  // Create a custom payment popup props with our own close handler
  const customPaymentProps = paymentPopupProps
    ? {
        ...paymentPopupProps,
        onClose: () => {
          // Use the hook's closePaymentPopup to ensure proper state cleanup
          closePaymentPopup();
        },
      }
    : null;

  return (
    <div className="pricing-page">
      <Navbar onSignupClick={handleFreeTrial} onLoginClick={handleLoginClick} />

      {/* Auth Popup for non-logged-in users */}
      {!isLoggedIn && authPopup.isOpen && (
        <AuthPopup
          onClose={() => setAuthPopup({ isOpen: false, mode: 'signup' })}
          mode={authPopup.mode}
        />
      )}

      {/* Payment Popup for logged-in users */}
      {isLoggedIn && paymentPopupOpen && customPaymentProps && (
        <Payment {...customPaymentProps} />
      )}

      <PricingPlans onSignupClick={handlePricingSignupClick} />

      <Footer />
    </div>
  );
};
