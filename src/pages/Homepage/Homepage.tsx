import { useState } from 'react';

import { FeatureHighlight, Navbar, AuthPopup } from '~components/index';
import { PricingPlans } from '~components/LandingPageComponent';

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
  const [authPopup, setAuthPopup] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({
    isOpen: false,
    mode: 'signup',
  });

  const handleJoinRequest = () => {
    setAuthPopup({ isOpen: true, mode: 'signup' });
  };

  const handleLoginRequest = () => {
    setAuthPopup({ isOpen: true, mode: 'login' });
  };

  return (
    <div>
      <Navbar
        onSignupClick={handleJoinRequest}
        onLoginClick={handleLoginRequest}
      />

      {/* Auth Popup */}
      {authPopup.isOpen && (
        <AuthPopup
          onClose={() => setAuthPopup({ isOpen: false, mode: 'signup' })}
          mode={authPopup.mode}
        />
      )}

      <Hero />
      <FeatureSection onGetStarted={handleJoinRequest} />
      <ReviewsFeature />
      <FeatureHighlight />
      <LandingShowcase />
      <LandingShowcase theme="dark" />
      <PricingPlans onSignupClick={handleJoinRequest} />
      <FinalLowerCTA onGetStarted={handleJoinRequest} />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
};
