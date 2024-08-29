import React from 'react';
import {
  FeatureHighlightSection,
  Footer,
  LowerCTA,
  MobileNavbar,
  Navbar,
  SupportedAppSection,
  TestimonialsSection,
} from '~components/index';

import StarImage from '~assets/images/star.png';
import './Homepage.scss';
import { PricingPlans } from '~components/LandingPageComponent/PricingPlans/PricingPlans';
import FAQ from '~components/LandingPageComponent/FaqSection/FaqSection';

export const Homepage = () => {
  return (
    <div>
      <div className="mobile-navbar-wrapper">
        <MobileNavbar />
      </div>
      <div className="desktop-navbar-wrapper">
        <Navbar />
      </div>

      <div className="hero-wrapper">
        <section className="hero">
          <div className="hero-content">
            <div className="new-badge">
              <span>NEW</span> Latest integration just arrived
            </div>
            <h1>
              Fast and Reliable <br />
              <span className="highlight">AI-Powered</span> <br />
              Homework Assistance
            </h1>
            <p className="description">
              Experience swift and dependable homework help with our AI-driven
              solution, ensuring clarity and improved academic results.
            </p>
            <a href="#" className="cta-button">
              Get Started Free
            </a>
            <div className="reviews">
              <div className="review-avatars">
                <img
                  src="https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1724630400&semt=ais_hybrid"
                  alt="Reviewer"
                />
                <img
                  src="https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1724630400&semt=ais_hybrid"
                  alt="Reviewer"
                />
                <img
                  src="https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1724630400&semt=ais_hybrid"
                  alt="Reviewer"
                />
                <img
                  src="https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1724630400&semt=ais_hybrid"
                  alt="Reviewer"
                />
              </div>
              <span className="rating">
                <img src={StarImage} alt="Star" />
                <p>4,000+ Students Boosting Grades with Us</p>
              </span>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://pelostudio-storyblok-assets.b-cdn.net/f/230682/2584x2584/2952209d67/enrichment-usecases-mockup-1.png/m/fit-in/1200x1200/smart/filters:quality(70)"
              alt="App screenshot"
            />
          </div>
        </section>
      </div>

      <SupportedAppSection />

      <FeatureHighlightSection />
      <FeatureHighlightSection primary />
      <FeatureHighlightSection />
      <FeatureHighlightSection primary />
      <FeatureHighlightSection />
      <FeatureHighlightSection primary />
      <TestimonialsSection />
      <PricingPlans />
      <FAQ />
      <LowerCTA />
      <Footer />
    </div>
  );
};
