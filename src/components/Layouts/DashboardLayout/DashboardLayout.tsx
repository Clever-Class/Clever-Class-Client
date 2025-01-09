import React, { ReactNode } from 'react';
import { Sidebar } from '~components/Sidebar/Sidebar';

import styles from './DashboardLayout.module.scss';
// import { Payment } from '~/components/Payment';
import { useSelector } from 'react-redux';
import { RootStateType } from '~store/types';
import { Payment } from '~components/Payment';

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { selectedPackage } = useSelector(
    (state: RootStateType) => state.register,
  );
  const { user } = useSelector((state: RootStateType) => state.user);

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      {user && selectedPackage && (
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
