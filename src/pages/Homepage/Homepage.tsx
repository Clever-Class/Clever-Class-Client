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
    </div>
  );
};
