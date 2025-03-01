import { Crown, Zap } from 'lucide-react';
import { Subscription, SubscriptionStatus } from '~store/types';
import { capitalizeFirstLetter } from '~/lib/utils';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import './SubscriptionInfo.scss';
import { api } from '~api';

interface SubscriptionInfoProps {
  subscription: Subscription | null;
  trialCredits: number;
  onSubscriptionUpdate?: () => void; // Add callback to refresh subscription data
}

export const SubscriptionInfo = ({
  subscription,
  trialCredits,
  onSubscriptionUpdate,
}: SubscriptionInfoProps) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!subscription) return null;

  const handleCancelSubscription = async () => {
    // Show confirmation dialog
    if (
      !window.confirm(
        'Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.',
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.ccServer.post('/subscription/cancel');

      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh subscription data if callback provided
        if (onSubscriptionUpdate) {
          onSubscriptionUpdate();
        }
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

  return (
    <div className="subscription-info">
      <h3 className="subscription-info__title">Subscription & Credits</h3>

      <div className="subscription-info__grid">
        <div className="subscription-info__plan">
          <div className="subscription-info__plan-header">
            <div className="subscription-info__plan-icon-container">
              <Crown className="subscription-info__plan-icon" />
            </div>
            <div>
              <h4>
                Subscription Status:{' '}
                {capitalizeFirstLetter(subscription.status)}
              </h4>
              <p>
                Current Billing Start Date:{' '}
                {moment(subscription.billingPeriod.starts_at)
                  .local()
                  .format('MMMM Do YYYY')}
              </p>
              <p>
                Current Billing End Date:{' '}
                {moment(subscription.billingPeriod.ends_at)
                  .local()
                  .format('MMMM Do YYYY')}
              </p>
              {/* Show effective from date if subscription is cancelled */}
              {subscription.status === 'canceled' &&
                subscription.billingPeriod?.ends_at && (
                  <p>
                    Effective From:{' '}
                    {moment(subscription.billingPeriod.ends_at)
                      .local()
                      .format('MMMM Do YYYY')}
                  </p>
                )}
            </div>
          </div>
          <div className="subscription-info__plan-actions">
            {/* Show update payment method button if subscription has an update payment method url */}
            {subscription.updatePaymentMethodUrl && (
              <a
                href={subscription.updatePaymentMethodUrl}
                className="subscription-info__action-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Update Payment Method
              </a>
            )}
            {/* Show cancel subscription button if subscription is not cancelled */}
            {subscription.status !== SubscriptionStatus.CANCELED && (
              <button
                onClick={handleCancelSubscription}
                className="subscription-info__action-link subscription-info__action-link--cancel"
                disabled={isLoading}
              >
                {isLoading ? 'Canceling...' : 'Cancel Subscription'}
              </button>
            )}
          </div>
        </div>

        <div className="subscription-info__credits">
          <div className="subscription-info__credits-header">
            <div className="subscription-info__credits-icon-container">
              <Zap className="subscription-info__credits-icon" />
            </div>
            <div>
              <h4>Trial Credits</h4>
              <p>{trialCredits} credits remaining</p>
            </div>
          </div>
          <div className="subscription-info__credits-bar">
            <div
              className="subscription-info__credits-progress"
              style={{ width: `${(trialCredits / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
