import React from 'react';
import RoundedLogo from '../../../../public/asset/rounded-logo-design.png';

import './CTASection.scss';

export const LowerCTA = () => {
  return (
    <section className="cta-section-wrapper">
      <div className="cta-section">
        <div className="cta-content">
          <h2>Next Generation AI Engine</h2>
          <p>
            Clever class utilizes a powerful AI Engine and advanced search
            algorithms to deliver precise solutions.
          </p>
          <button className="cta-button">
            Get Started Free
            <span className="arrow">→</span>
          </button>
        </div>
        {/* <img src={RoundedLogo} alt="" /> */}
      </div>
    </section>
  );
};
