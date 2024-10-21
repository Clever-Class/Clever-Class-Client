import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '~constants';
import { Button } from '~components/ui/button';
import styles from './SuccessPayment.module.scss';

export const SuccessPayment = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        <div className={styles.checkmarkCircle}>
          <div className={styles.checkmark}>✓</div>
        </div>
        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.message}>
          Thank you for your purchase. <br />
          Your subscription has been activated.
        </p>
        {/* <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Amount Paid:</span>
            <span className={styles.value}>$XX.XX</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Transaction ID:</span>
            <span className={styles.value}>#XXXXXXXX</span>
          </div>
        </div> */}
        <Button
          onClick={() => navigate(AppRoutes.Dashboard)}
          className={styles.dashboardButton}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};
