import { useEffect } from 'react';
import { PersonalInfo, SubscriptionInfo, UserInfo } from '~components/Profile';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '~store';
import { fetchUserData } from '~store/actions';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsHeader}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Settings
        </motion.h1>
        <p className={styles.subtitle}>
          Manage your account preferences and subscription
        </p>
      </div>

      <div className={styles.settingsContent}>
        <motion.div
          className={styles.settingsGrid}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="initial"
          animate="animate"
        >
          <motion.div {...fadeInUp} className={styles.settingsCard}>
            <UserInfo user={user} />
          </motion.div>

          <motion.div {...fadeInUp} className={styles.settingsCard}>
            <PersonalInfo user={user} />
          </motion.div>

          <motion.div
            {...fadeInUp}
            className={`${styles.settingsCard} ${styles.fullWidth}`}
          >
            <SubscriptionInfo
              subscription={subscription}
              trialCredits={user.trialCredits}
              onSubscriptionUpdate={() => {
                dispatch(fetchUserData());
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
