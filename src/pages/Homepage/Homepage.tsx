import { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  FeatureHighlight,
  FeatureHighlightSection,
  Footer,
  LowerCTA,
  MobileNavbar,
  Navbar,
  SignupPopup,
  SupportedAppSection,
  TestimonialsSection,
} from '~components/index';
import { PricingPlans } from '~components/LandingPageComponent/PricingPlans/PricingPlans';

import StarImage from '~assets/images/star.png';
import FAQ from '~components/LandingPageComponent/FaqSection/FaqSection';

import './Homepage.scss';
import Hero from '~components/Hero';
import FeatureSection from '~components/LandingPageComponent/FeatureSection';
import ReviewsFeature from '~components/LandingPageComponent/ReviewsFeature';

export const Homepage = () => {
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
    <div>
      <div className="mobile-navbar-wrapper">
        <MobileNavbar />
      </div>
      <div className="desktop-navbar-wrapper">
        <Navbar onSignupClick={handleFreeTrial} />
      </div>

      {/* Signup Popup */}
      {signupPopup && <SignupPopup onClose={() => setSignupPopup(false)} />}

      <Hero />
      <FeatureSection onGetStarted={handleFreeTrial} />
      <ReviewsFeature />
      <FeatureHighlight />
      <SupportedAppSection />
      <FeatureHighlightSection />
      <FeatureHighlightSection primary />
      <FeatureHighlightSection />
      <FeatureHighlightSection primary />
      <FeatureHighlightSection />
      <FeatureHighlightSection primary />
      <TestimonialsSection />
      <PricingPlans onSignupClick={handlePricingSignupClick} />
      <FAQ />
      <LowerCTA />
      <Footer />
    </div>
  );
};
