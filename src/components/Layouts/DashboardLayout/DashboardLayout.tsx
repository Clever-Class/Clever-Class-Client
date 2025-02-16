import React, { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from '~components/Sidebar/Sidebar';

import styles from './DashboardLayout.module.scss';
import { useSelector } from 'react-redux';
import { RootStateType } from '~store/types';
import { Payment } from '~components/Payment';
import { DEFAULT_SELECTED_PACKAGE } from '~constants';

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { user, subscription } = useSelector(
    (state: RootStateType) => state.user,
  );
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const lastShownDate = localStorage.getItem('paymentPopupLastShown');
    const hasPendingSubscription = subscription?.status === 'pending';

    const is24HoursPassed = () => {
      if (!lastShownDate) return true;
      const lastShown = new Date(lastShownDate);
      const now = new Date();
      const hoursDifference =
        Math.abs(now.getTime() - lastShown.getTime()) / (1000 * 60 * 60);
      return hoursDifference > 24;
    };

    if (user && hasPendingSubscription && is24HoursPassed()) {
      setShowPopup(true);
      localStorage.setItem('paymentPopupLastShown', new Date().toISOString());
    }
  }, [user]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const packageId = user?.selectedPackageId || DEFAULT_SELECTED_PACKAGE;

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      {showPopup && user && (
        <Payment
          userId={user.id}
          priceId={packageId}
          countryCode={user?.country}
          email={user?.email}
          onClose={handleClosePopup}
        />
      )}
      <div className={styles.mainContent}>
        <main className={styles.content}>
          <div className={styles.container}>{children}</div>
        </main>
      </div>
    </div>
  );
};
