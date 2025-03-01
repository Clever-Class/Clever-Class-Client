import { PersonalInfo, SubscriptionInfo, UserInfo } from '~components/Profile';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '~store';
import { fetchUserData } from '~store/actions';

import './settings.scss';

export const Settings = () => {
  const { user, subscription } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
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
          onSubscriptionUpdate={() => {
            dispatch(fetchUserData());
          }}
        />
      </div>
    </div>
  );
};
