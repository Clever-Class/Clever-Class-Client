import React from 'react';

import { SocialButtonProps } from './SocialButton.types';

import styles from './SocialButton.module.scss';

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  logo,
  onClick,
}) => {
  console.log(provider, 'provider');
  return (
    <button
      className={`${styles.button} ${styles[provider.toLowerCase()]}`}
      onClick={onClick}
    >
      <img src={logo} alt={`${provider} logo`} className={styles.logo} />
      <p className={styles.buttonText}>Sign Up with {provider}</p>
    </button>
  );
};
