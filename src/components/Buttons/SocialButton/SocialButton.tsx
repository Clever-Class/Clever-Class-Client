import React from 'react';
import { SocialButtonProps } from './SocialButton.types';
import styles from './SocialButton.module.scss';

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  icon: Icon,
  onClick,
  title,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[provider.toLowerCase()]}`}
      onClick={onClick}
    >
      <Icon className={styles.icon} />
      <p className={styles.buttonText}>
        {title} {provider}
      </p>
    </button>
  );
};
