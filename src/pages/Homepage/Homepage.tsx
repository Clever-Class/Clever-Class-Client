import { useState } from 'react';

import { QuizBuilderSection, Navbar, AuthPopup } from '~components/index';
import { PricingPlans } from '~components/LandingPageComponent';

import FAQ from '~components/LandingPageComponent/FaqSection/FaqSection';

import './Homepage.scss';
import Hero from '~components/Hero';
import ChromeExtensionSection from '~components/LandingPageComponent/ChromeExtensionSection';
import ReviewsFeature from '~components/LandingPageComponent/ReviewsFeature';
import FinalLowerCTA from '~/components/LandingPageComponent/FinalLowerCTA';
import LandingShowcase from '~components/LandingShowcase';
import Footer from '~components/Footer/Footer';
import CTASection from '~components/CTASection';
import { FaYoutube, FaHeadphones, FaFileAlt } from 'react-icons/fa';
import { RiRobot2Line } from 'react-icons/ri';

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

  const lectureSummarizerFeatures = [
    {
      icon: <FaYoutube />,
      badge: 'YOUTUBE',
      title: 'YouTube Video Analysis',
      description: 'Extract insights from any YouTube video instantly'
    },
    {
      icon: <FaHeadphones />,
      badge: 'PODCAST',
      title: 'Podcast Summarization',
      description: 'Get key points from podcasts in seconds'
    },
    {
      icon: <FaFileAlt />,
      badge: 'INSIGHTS',
      title: 'AI-Powered Analysis',
      description: 'Smart extraction of important information'
    }
  ];

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
      <ChromeExtensionSection onGetStarted={handleJoinRequest} />
      <ReviewsFeature />
      <QuizBuilderSection />
      <LandingShowcase onButtonClick={handleJoinRequest} />
      <LandingShowcase 
        theme="dark" 
        badgeIcon={<RiRobot2Line />}
        badgeText="Lecture Summarizer"
        title="Extract Key Insights from Any Content"
        highlightedWord="Key Insights"
        description="Extract key insights from any YouTube video or podcast in seconds with AI."
        features={lectureSummarizerFeatures}
        buttonText="Try Summarizer"
        onButtonClick={handleJoinRequest}
      />
      <PricingPlans onSignupClick={handleJoinRequest} />
      <FinalLowerCTA onGetStarted={handleJoinRequest} />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
};
