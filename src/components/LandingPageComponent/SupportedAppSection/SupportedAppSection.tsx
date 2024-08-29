import React from 'react';

import './SupportedAppSection.scss';

export const SupportedAppSection = () => {
  return (
    <div className="supported-app-section">
      <div className="client-logos-section">
        <p className="heading">
          They have sweetened their sales experience with ZELIQ
        </p>
        <div className="logos">
          <img
            src="https://studybuddy.gg/assets/images/platforms/svgs/canvas.svg"
            alt="Canvas"
          />
          <img
            src="https://studybuddy.gg/assets/images/platforms/svgs/blackboard.svg"
            alt="Blackboard"
          />
          <img
            src="https://studybuddy.gg/assets/images/platforms/svgs/schoology.svg"
            alt="Schology"
          />
          <img
            src="https://studybuddy.gg/assets/images/platforms/svgs/d2l.svg"
            alt="Bolt"
          />
          <img
            src="https://studybuddy.gg/assets/images/platforms/svgs/respondus.svg"
            alt="Accenture"
          />
        </div>
      </div>
      <img
        src={
          'https://pelostudio-storyblok-assets.b-cdn.net/f/230682/2339x1366/cee135d5e8/video-thumbnail.png/m/fit-in/2339x1364/smart/filters:quality(70)'
        }
        className="supported-app-video-thumbnail"
        alt=""
      />
    </div>
  );
};
