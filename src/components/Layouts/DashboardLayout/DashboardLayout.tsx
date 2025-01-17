import React, { ReactNode, useCallback, useEffect } from 'react';
import { Sidebar } from '~components/Sidebar/Sidebar';

import styles from './DashboardLayout.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootStateType } from '~store/types';
import { Payment } from '~components/Payment';
import { fetchUserDataAfterPayment } from '~/lib/dashboard';
import { SET_USER } from '~constants';

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const { selectedPackage } = useSelector(
    (state: RootStateType) => state.register,
  );

  const { user } = useSelector((state: RootStateType) => state.user);
  const searchParams = new URLSearchParams(window.location.search);
  const showPaymentPopup = searchParams.get('payment_popup') === 'true';

  // Fetch user data after payment
  const fetchUserData = useCallback(async () => {
    try {
      const userData = await fetchUserDataAfterPayment();
      dispatch({ type: SET_USER, payload: { user: userData, token: null } });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [dispatch]);

  // Fetch user data after payment
  useEffect(() => {
    fetchUserData();
  }, [selectedPackage, fetchUserData]);

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      {user && selectedPackage && showPaymentPopup && (
        <Payment
          userId={user.id}
          priceId={selectedPackage}
          countryCode={user?.country}
          email={user?.email}
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
