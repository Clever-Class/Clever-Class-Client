import React, { useState } from 'react';
import { Turn as Hamburger } from 'hamburger-react';

import CleverClassLogo from '~assets/images/logo.png';
import './MobileNavbar.scss';

export const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="mobile-navbar">
      <div className="mobile-navbar__logo">
        <img src={CleverClassLogo} alt="Clever Class Logo" />
        <span>Clever Class</span>
      </div>
      <div className={`mobile-navbar__menu ${isOpen ? 'open' : ''}`}>
        <ul>
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
      </div>
      <Hamburger direction="left" onToggle={toggleMenu} />
    </nav>
  );
};
