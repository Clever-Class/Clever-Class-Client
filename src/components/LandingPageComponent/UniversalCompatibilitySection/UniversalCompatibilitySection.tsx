import React from 'react';

import LandingPageImage from '~assets/images/heroImage-demo.png';
import tick from '~assets/images/tick.svg';

import './UniversalCompatibilitySection.scss';

interface UniversalCompatibilitySectionProps {
  primary?: boolean;
}

export const UniversalCompatibilitySection: React.FC<
  UniversalCompatibilitySectionProps
> = ({ primary }) => {
  return (
    <div
      className={`${
        primary
          ? 'feature-highlight-section-wrapper-primary'
          : 'feature-highlight-section-wrapper-secondary'
      } landing-section-wrapper`}
    >
      <section
        className={`feature-highlight-section ${
          !primary ? 'feature-highlight-reverse' : ''
        }`}
      >
        <div className="content">
          <div className="badge">
            <img src={tick} alt="" />
            Universal Compatibility
          </div>
          <h2 className="title">One Click Question Solving</h2>
          <p className="description">
            With just a click, get detailed solutions to your assignment
            questions, helping you understand complex concepts and enhance your
            problem-solving skills. Clever class is optimized with specialized
            support for more than 15 popular learning platforms.
          </p>
        </div>
        <div className="image">
          <img src={LandingPageImage} alt="Clever Class" />
        </div>
      </section>
    </div>
  );
};
