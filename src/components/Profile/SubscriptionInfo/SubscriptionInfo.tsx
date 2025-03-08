import { motion } from 'framer-motion';
import { Crown, Gift } from 'lucide-react';
import { Subscription, SubscriptionStatus } from '~store/types';
import { capitalizeFirstLetter } from '~/lib/utils';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '~api';
import styles from './SubscriptionInfo.module.scss';

interface SubscriptionInfoProps {
  subscription: Subscription | null;
  trialCredits: number;
  onSubscriptionUpdate?: () => void;
}

export const SubscriptionInfo = ({
  subscription,
  trialCredits,
  onSubscriptionUpdate,
}: SubscriptionInfoProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelSubscription = async () => {
    if (
      !window.confirm('Cancel subscription? Access continues until period end.')
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.ccServer.post('/subscription/cancel');

      if (response.data.success) {
        toast.success(response.data.message);
        onSubscriptionUpdate?.();
      } else {
        toast.error(response.data.message || 'Failed to cancel subscription');
      }
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to cancel subscription',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate credit usage
  const totalCredits = 5; // Total trial credits
  const remainingCredits = trialCredits || 0;
  const usedCredits = totalCredits - remainingCredits;

  // Calculate circle properties
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = (usedCredits / totalCredits) * 100;
  const dashOffset = ((100 - progressPercentage) / 100) * circumference;

  return (
    <motion.div
      className={styles.subscriptionInfo}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className={styles.title}>Subscription & Credits</h3>
      <div className={styles.grid}>
        <motion.div
          className={styles.plan}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.planHeader}>
            <div className={styles.iconContainer}>
              <Crown />
            </div>
            <div>
              <h4>
                Status:{' '}
                {subscription
                  ? capitalizeFirstLetter(subscription.status)
                  : 'Trial'}
              </h4>
              {subscription?.billingPeriod && (
                <>
                  <p>
                    Start:{' '}
                    {moment(subscription.billingPeriod.starts_at)
                      .local()
                      .format('MMM D, YYYY')}
                  </p>
                  <p>
                    End:{' '}
                    {moment(subscription.billingPeriod.ends_at)
                      .local()
                      .format('MMM D, YYYY')}
                  </p>
                  {subscription.status === SubscriptionStatus.CANCELED && (
                    <p>
                      Effective:{' '}
                      {moment(subscription.billingPeriod.ends_at)
                        .local()
                        .format('MMM D, YYYY')}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className={styles.planActions}>
            {subscription?.updatePaymentMethodUrl && (
              <motion.a
                href={subscription.updatePaymentMethodUrl}
                className={`${styles.actionButton} ${styles.primary}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Update Payment
              </motion.a>
            )}
            {subscription?.status !== SubscriptionStatus.CANCELED && (
              <motion.button
                onClick={handleCancelSubscription}
                className={`${styles.actionButton} ${styles.danger}`}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? 'Canceling...' : 'Cancel'}
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div
          className={styles.credits}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={styles.creditsHeader}>
            <div className={styles.iconContainer}>
              <Gift />
            </div>
            <div>
              <h4>Trial Credits</h4>
              <p>{remainingCredits} remaining</p>
            </div>
          </div>
          <div className={styles.creditsContent}>
            <div className={styles.progressRing}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle
                  className={styles.background}
                  cx="45"
                  cy="45"
                  r={radius}
                />
                <motion.circle
                  className={styles.progress}
                  cx="45"
                  cy="45"
                  r={radius}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </svg>
              <div className={styles.progressText}>
                <div className={styles.used}>{usedCredits}</div>
                <div className={styles.label}>Used</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SubscriptionInfo;
