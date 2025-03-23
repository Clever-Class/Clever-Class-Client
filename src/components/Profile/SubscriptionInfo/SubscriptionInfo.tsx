import { motion } from 'framer-motion';
import { Crown, Gift, RefreshCw } from 'lucide-react';
import { Subscription, SubscriptionStatus } from '~store/types';
import { capitalizeFirstLetter } from '~/lib/utils';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  cancelSubscription,
  pauseSubscription,
  resumeCanceledSubscription,
  syncPaddleSubscription,
} from '~api';
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
  const [isSyncing, setIsSyncing] = useState(false);

  const handleCancelSubscription = async () => {
    if (
      !window.confirm('Cancel subscription? Access continues until period end.')
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await cancelSubscription();

      if (response.success) {
        toast.success(response.message);
        onSubscriptionUpdate?.();
      } else {
        toast.error(response.message || 'Failed to cancel subscription');
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

  const handleSyncSubscription = async () => {
    setIsSyncing(true);
    try {
      const response = await syncPaddleSubscription();

      if (response.success) {
        toast.success('Subscription synced successfully');
        onSubscriptionUpdate?.();
      } else {
        toast.error(response.message || 'Failed to sync subscription');
      }
    } catch (error: any) {
      console.error('Error syncing subscription:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to sync subscription',
      );
    } finally {
      setIsSyncing(false);
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
      <div className={styles.titleRow}>
        <h3 className={styles.title}>Subscription & Credits</h3>
        {subscription && (
          <button
            className={styles.syncButton}
            onClick={handleSyncSubscription}
            disabled={isSyncing}
          >
            <RefreshCw className={isSyncing ? styles.rotating : ''} size={16} />
            {isSyncing ? 'Syncing...' : 'Sync'}
          </button>
        )}
      </div>
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
              {subscription?.status === SubscriptionStatus.TRIALING && (
                <p className={styles.trial}>
                  Trial ends:{' '}
                  {moment(subscription.billingPeriod.ends_at).format(
                    'MMM DD, YYYY',
                  )}
                </p>
              )}
              {subscription?.billingPeriod && (
                <>
                  <p>
                    Current period starts:{' '}
                    {moment(subscription.billingPeriod.starts_at).format(
                      'MMM DD, YYYY',
                    )}
                  </p>
                  <p>
                    Current period ends:{' '}
                    {moment(subscription.billingPeriod.ends_at).format(
                      'MMM DD, YYYY',
                    )}
                  </p>
                </>
              )}
              {subscription?.status === SubscriptionStatus.CANCELED && (
                <p className={styles.cancelMessage}>
                  Your subscription will end on{' '}
                  {moment(subscription.billingPeriod.ends_at).format(
                    'MMMM DD, YYYY',
                  )}
                </p>
              )}
            </div>
          </div>

          {subscription?.updatePaymentMethodUrl && (
            <a
              href={subscription.updatePaymentMethodUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.updateButton}
            >
              Update Payment Method
            </a>
          )}

          {subscription?.status !== SubscriptionStatus.CANCELED &&
            subscription?.status !== SubscriptionStatus.NOT_STARTED && (
              <button
                className={styles.cancelButton}
                onClick={handleCancelSubscription}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Cancel Subscription'}
              </button>
            )}
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
