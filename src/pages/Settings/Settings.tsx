import { PersonalInfo, SubscriptionInfo, UserInfo } from '~components/Profile';

import { useSelector } from 'react-redux';
import { RootState } from '~store';

import './settings.scss';

export const Settings = () => {
  const { user, subscription } = useSelector((state: RootState) => state.user);
  console.log(user, subscription);

  if (!user) {
    return (
      <div className="profile-page">
        <h1 className="profile-page__title">My Profile</h1>
        <div className="profile-page__content">
          <p>Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1 className="profile-page__title">My Profile</h1>

      <div className="profile-page__content">
        <UserInfo user={user} />
        <PersonalInfo user={user} />
        <SubscriptionInfo
          subscription={subscription}
          trialCredits={user.trialCredits}
        />
      </div>
    </div>
  );
};
