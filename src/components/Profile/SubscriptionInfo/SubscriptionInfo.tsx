import { Crown, Zap } from 'lucide-react';
import './SubscriptionInfo.scss';

interface SubscriptionInfoProps {
  subscription: {
    plan: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  trialCredits: number;
}

export const SubscriptionInfo = ({
  subscription,
  trialCredits,
}: SubscriptionInfoProps) => {
  const startDate = new Date(subscription.startDate).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  );

  const endDate = new Date(subscription.endDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="subscription-info">
      <h3 className="subscription-info__title">Subscription & Credits</h3>

      <div className="subscription-info__grid">
        <div className="subscription-info__plan">
          <div className="subscription-info__plan-header">
            <Crown className="subscription-info__plan-icon" />
            <div>
              <h4>{subscription.plan} Plan</h4>
              <p>Active subscription</p>
            </div>
          </div>
          <div className="subscription-info__plan-dates">
            <div>
              <label>Start Date</label>
              <div>{startDate}</div>
            </div>
            <div>
              <label>End Date</label>
              <div>{endDate}</div>
            </div>
          </div>
        </div>

        <div className="subscription-info__credits">
          <div className="subscription-info__credits-header">
            <Zap className="subscription-info__credits-icon" />
            <div>
              <h4>Trial Credits</h4>
              <p>{trialCredits} credits remaining</p>
            </div>
          </div>
          <div className="subscription-info__credits-bar">
            <div
              className="subscription-info__credits-progress"
              style={{ width: `${(trialCredits / 100) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
