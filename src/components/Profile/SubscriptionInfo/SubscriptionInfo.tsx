import { Crown, Gift, Sparkles } from 'lucide-react';
import { Subscription, SubscriptionStatus } from '~store/types';
import { capitalizeFirstLetter } from '~/lib/utils';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { cancelSubscription, resumeCanceledSubscription } from '~api';
import styles from './SubscriptionInfo.module.scss';
import { useNavigate } from 'react-router-dom';

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
  const [isResuming, setIsResuming] = useState(false);
  const [isPulsingButton, setIsPulsingButton] = useState(false);
  const navigate = useNavigate();

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

  const handleResumeSubscription = async () => {
    setIsResuming(true);
    try {
      const response = await resumeCanceledSubscription();

      if (response.success) {
        toast.success('Subscription resumed successfully');
        onSubscriptionUpdate?.();
      } else {
        toast.error(response.message || 'Failed to resume subscription');
      }
    } catch (error: any) {
      console.error('Error resuming subscription:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to resume subscription',
      );
    } finally {
      setIsResuming(false);
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

  // Function to handle upgrade button hover animation
  const handleUpgradeHover = () => {
    setIsPulsingButton(true);
  };

  const handleUpgradeLeave = () => {
    setIsPulsingButton(false);
  };

  // Function to handle upgrade click
  const handleUpgradeClick = () => {
    // Here you can add the logic to redirect to subscription page
    navigate('/pricing');
  };

  // Check if subscription is in not_started or pending state
  const isInactiveSubscription =
    !subscription ||
    subscription.status === SubscriptionStatus.NOT_STARTED ||
    subscription.status === SubscriptionStatus.PENDING;

  return (
    <div className={styles.subscriptionInfo}>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>Subscription & Credits</h3>
      </div>
      <div className={styles.grid}>
        <div className={styles.plan}>
          {isInactiveSubscription ? (
            <div className={styles.upgradeCTA}>
              <div className={styles.upgradeContent}>
                <div
                  className={`${styles.iconContainer} ${styles.sparkleIcon}`}
                >
                  <Sparkles />
                </div>
                <div className={styles.upgradeText}>
                  <h4>Unlock Premium Features</h4>
                  <p>Get unlimited access to all premium features and tools.</p>
                </div>
              </div>
              <button
                className={`${styles.upgradeButton} ${
                  isPulsingButton ? styles.pulsing : ''
                }`}
                onMouseEnter={handleUpgradeHover}
                onMouseLeave={handleUpgradeLeave}
                onClick={handleUpgradeClick}
              >
                <span className={styles.buttonText}>Upgrade to Pro</span>
                <span className={styles.sparkleWrapper}>
                  <Sparkles size={16} />
                </span>
              </button>
            </div>
          ) : (
            <>
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

              {subscription?.status === SubscriptionStatus.CANCELED && (
                <button
                  className={`${styles.cancelButton} ${styles.dontCancelButton}`}
                  onClick={handleResumeSubscription}
                  disabled={isResuming}
                >
                  {isResuming ? 'Processing...' : "Don't Cancel"}
                </button>
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
            </>
          )}
        </div>

        <div className={styles.credits}>
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
                <circle
                  className={styles.progress}
                  cx="45"
                  cy="45"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className={styles.progressText}>
                <div className={styles.used}>{usedCredits}</div>
                <div className={styles.label}>Used</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionInfo;
