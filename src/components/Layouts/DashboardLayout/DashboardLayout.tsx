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
  // const dispatch = useDispatch();

  const { user } = useSelector((state: RootStateType) => state.user);
  const searchParams = new URLSearchParams(window.location.search);
  const showPaymentPopup = searchParams.get('payment_popup') === 'true';

  const [showPopup, setShowPopup] = useState(false);

  // const fetchUserData = useCallback(async () => {
  //   try {
  //     const userData = await fetchUserDataAfterPayment();
  //     dispatch({ type: SET_USER, payload: { user: userData, token: null } });
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // }, [dispatch]);

  useEffect(() => {
    const lastShownDate = localStorage.getItem('paymentPopupLastShown');
    const hasActiveSubscription = user?.subscription?.status === 'active';

    const shouldShowPopup = () => {
      if (!lastShownDate) return true;
      const lastShown = new Date(lastShownDate);
      const now = new Date();

      // 24 hours in milliseconds
      const hoursDifference =
        Math.abs(now.getTime() - lastShown.getTime()) / (1000 * 60 * 60);
      return hoursDifference > 24;
    };

    if (
      (showPaymentPopup || shouldShowPopup()) &&
      user &&
      !hasActiveSubscription
    ) {
      setShowPopup(true);
      if (!showPaymentPopup) {
        localStorage.setItem('paymentPopupLastShown', new Date().toISOString());
      }
    }
  }, [user, showPaymentPopup]);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem('paymentPopupLastShown', new Date().toISOString());
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
