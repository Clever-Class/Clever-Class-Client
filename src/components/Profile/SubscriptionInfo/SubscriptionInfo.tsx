import { Crown, Zap } from 'lucide-react';
import { Subscription } from '~store/types';
import { capitalizeFirstLetter } from '~/lib/utils';
import moment from 'moment';

import './SubscriptionInfo.scss';

interface SubscriptionInfoProps {
  subscription: Subscription | null;
  trialCredits: number;
}

export const SubscriptionInfo = ({
  subscription,
  trialCredits,
}: SubscriptionInfoProps) => {
  if (!subscription) return null;

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
              {subscription.status === 'cancelled' &&
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
            {subscription.cancelSubscriptionUrl &&
              subscription.status !== 'cancelled' && (
                <a
                  href={subscription.cancelSubscriptionUrl}
                  className="subscription-info__action-link subscription-info__action-link--cancel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cancel Subscription
                </a>
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
