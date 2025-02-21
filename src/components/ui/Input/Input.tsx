import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.scss';
import classNames from 'classnames';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className,
      rightIcon,
      leftIcon,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={classNames(styles.container, containerClassName)}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputWrapper}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <input
            ref={ref}
            className={classNames(
              styles.input,
              {
                [styles.error]: error,
                [styles.withLeftIcon]: leftIcon,
                [styles.withRightIcon]: rightIcon,
              },
              className,
            )}
            {...props}
          />
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
