import React from 'react';
import styles from './WarningBanner.module.scss';

interface WarningBannerProps {
  message: string;
  buttonText: string;
  onButtonClick: () => void;
  noButton?: boolean;
}

export const WarningBanner: React.FC<WarningBannerProps> = ({
  message,
  buttonText,
  onButtonClick,
  noButton,
}) => {
  return (
    <div className={styles.warningBanner}>
      <div className={`${styles.creditsIconContainer}`}>
        <svg
          className={styles.warningIcon}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0V9a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span>{message}</span>
      {!noButton && (
        <button onClick={onButtonClick} className={styles.updateButton}>
          {buttonText}
        </button>
      )}
    </div>
  );
};
