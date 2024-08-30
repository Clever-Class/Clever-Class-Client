import React, { useState } from 'react';
import CleverClassLogo from '~assets/images/logo.png';

import { SignupPopup } from '~components/SignupPopup/SignupPopup';

import './Navbar.scss';

export const Navbar = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <header className="header">
      <nav className="navbar desktop-nav">
        <div className="navbar__logo">
          <img src={CleverClassLogo} alt="Clever Class Logo" />
          <span className="navbar__logo-text">Clever Class</span>
        </div>
        <ul className="navbar__links">
          <li>
            <a href="#features">Feature</a>
          </li>
          <li>
            <a href="#demo">Demo</a>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
          <li>
            <a href="#about-us">About Us</a>
          </li>
        </ul>
        <div className="navbar__actions">
          <a href="#login" className="navbar__login">
            Log in
          </a>
          <a
            href="#start-trial"
            className="navbar__start-trial"
            onClick={() => setShowPopup(true)}
          >
            Start free trial
          </a>
        </div>
      </nav>
      <div>
        {showPopup && <SignupPopup onClose={() => setShowPopup(false)} />}
      </div>
    </header>
  );
};
