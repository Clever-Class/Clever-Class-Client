import React from 'react';
import { MobileNavbar, Navbar } from '~components/index';

import './Homepage.scss';

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
            <p>
              Experience swift and dependable homework help with our AI-driven
              solution, ensuring clarity and improved academic results.
            </p>
            <a href="#" className="cta-button">
              Get Started Free
            </a>
            <div className="reviews">
              <span>15K reviews on</span>
              <span className="rating">
                <img src="star-icon.png" alt="Star" /> 4.9
              </span>
              <div className="review-avatars">
                <img src="avatar1.png" alt="Reviewer" />
                <img src="avatar2.png" alt="Reviewer" />
                <img src="avatar3.png" alt="Reviewer" />
              </div>
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
    </div>
  );
};
