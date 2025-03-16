import { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  FeatureHighlight,
  LowerCTA,
  Navbar,
  SignupPopup,
  SupportedAppSection,
  TestimonialsSection,
} from '~components/index';
import PricingPlans from '~components/LandingPageComponent/PricingPlans/PricingPlans';

import StarImage from '~assets/images/star.png';
import FAQ from '~components/LandingPageComponent/FaqSection/FaqSection';

import './Homepage.scss';
import Hero from '~components/Hero';
import FeatureSection from '~components/LandingPageComponent/FeatureSection';
import ReviewsFeature from '~components/LandingPageComponent/ReviewsFeature';
import FinalLowerCTA from '~/components/LandingPageComponent/FinalLowerCTA';
import LandingShowcase from '~components/LandingShowcase';
import Footer from '~components/Footer/Footer';
import CTASection from '~components/CTASection';

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

  const handleGetStarted = () => {
    // Your get started logic here
  };

  return (
    <div>
      <Navbar onSignupClick={handleFreeTrial} />

      {/* Signup Popup */}
      {signupPopup && <SignupPopup onClose={() => setSignupPopup(false)} />}

      <Hero />
      <FeatureSection onGetStarted={handleFreeTrial} />
      <ReviewsFeature />
      <FeatureHighlight />
      <LandingShowcase />
      <LandingShowcase theme="dark" />
      <FinalLowerCTA onGetStarted={handleGetStarted} />
      <FAQ />
      <CTASection />
      <Footer />
      {/* <SupportedAppSection />
      <FeatureHighlightSection primary />
      <FeatureHighlightSection />
      <FeatureHighlightSection primary />
      <TestimonialsSection />
      <PricingPlans onSignupClick={handlePricingSignupClick} />
      <LowerCTA />
      */}
    </div>
  );
};
