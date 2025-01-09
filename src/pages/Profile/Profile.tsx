import { PersonalInfo, SubscriptionInfo, UserInfo } from '~components/Profile';

import './profile.scss';

export const Profile = () => {
  const user = {
    firstName: 'Rafiqur',
    lastName: 'Rahman',
    email: 'rafiqurrahman51@gmail.com',
    role: 'Team Manager',
    country: 'United Kingdom',
    countryCode: 'US',
    city: 'Leeds',
    joinedDate: '2023-12-01',
    trialCredits: 100,
    subscription: {
      plan: 'Pro',
      startDate: '2023-12-15',
      endDate: '2024-12-15',
      status: 'active',
    },
  };

  return (
    <div className="profile-page">
      <h1 className="profile-page__title">My Profile</h1>

      <div className="profile-page__content">
        <UserInfo user={user} />
        <PersonalInfo user={user} />
        <SubscriptionInfo
          subscription={user.subscription}
          trialCredits={user.trialCredits}
        />
      </div>
    </div>
  );
};
