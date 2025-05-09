import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

// Components
import { PersonalInfo, SubscriptionInfo, UserInfo } from '~components/Profile';

// Store and Types
import { RootState, AppDispatch } from '~store';
import { fetchUserData } from '~store/actions';

import styles from './Settings.module.scss';

export const Settings = () => {
  const { user, subscription, loading } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className={styles.settingsPage}>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loadingSpinner} />
          <p>Loading your settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.settingsPage}>
        <div className={styles.errorContainer}>
          <p>Unable to load user information. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsHeader}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>
          Manage your account preferences and subscription
        </p>
      </div>

      <div className={styles.settingsContent}>
        <div className={styles.settingsGrid}>
          <div className={styles.settingsCard}>
            <UserInfo user={user} />
          </div>

          <div className={styles.settingsCard}>
            <PersonalInfo user={user} />
          </div>

          <div className={`${styles.settingsCard} ${styles.fullWidth}`}>
            <SubscriptionInfo
              subscription={subscription}
              trialCredits={user?.trialCredits || 0}
              onSubscriptionUpdate={() => {
                dispatch(fetchUserData());
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
