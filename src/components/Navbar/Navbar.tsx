import React from 'react';
import Cookies from 'js-cookie';

import CleverClassLogo from '~assets/images/logo.png';
import { RxDashboard } from 'react-icons/rx';

import './Navbar.scss';

interface NavbarProps {
  onSignupClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSignupClick }) => {
  const userToken = Cookies.get('userToken');

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
          {userToken ? (
            <div className="navbar__dashboard">
              <a href="/dashboard" title="Go to Dashboard">
                <RxDashboard className="icon" href="/dashboard" />
              </a>
              <a href="/dashboard" className="dashboard_link">
                Dashboard
              </a>
            </div>
          ) : (
            <div className="navbar__auth">
              <a href="/login" className="navbar__login">
                Log in
              </a>
              <a
                href="#start-trial"
                className="navbar__start-trial"
                onClick={onSignupClick}
              >
                Start free trial
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
