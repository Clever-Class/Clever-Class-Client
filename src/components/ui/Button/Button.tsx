import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      isLoading,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          styles.button,
          styles[variant],
          styles[size],
          {
            [styles.fullWidth]: fullWidth,
            [styles.loading]: isLoading,
            [styles.disabled]: disabled,
          },
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className={styles.loader} />}
        {!isLoading && leftIcon && (
          <span className={styles.leftIcon}>{leftIcon}</span>
        )}
        <span className={styles.content}>{children}</span>
        {!isLoading && rightIcon && (
          <span className={styles.rightIcon}>{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
