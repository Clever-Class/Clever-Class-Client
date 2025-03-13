import React from 'react';
import styles from './WarningBanner.module.scss';

interface WarningBannerProps {
  message: string;
  buttonText: string;
  onButtonClick: () => void;
  onClose?: () => void;
  noButton?: boolean;
  disabled?: boolean;
}

export const WarningBanner: React.FC<WarningBannerProps> = ({
  message,
  buttonText,
  onButtonClick,
  onClose,
  noButton = false,
  disabled = false,
}) => {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className={styles.warningBanner}>
      <div className={styles.bannerContent}>
        <div className={styles.creditsIconContainer}>
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
      </div>
      <div className={styles.bannerActions}>
        {!noButton && (
          <button
            onClick={onButtonClick}
            className={styles.updateButton}
            disabled={disabled}
          >
            {buttonText}
          </button>
        )}
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Close banner"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
