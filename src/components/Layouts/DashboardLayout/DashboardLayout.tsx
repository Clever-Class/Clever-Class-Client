import React, { ReactNode } from 'react';
import { DashboardSidebar } from '~components/Sidebar/Sidebar';

import styles from './DashboardLayout.module.scss';

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <div className={styles.mainContent}>
        <main className={styles.content}>
          <div className={styles.container}>{children}</div>
        </main>
      </div>
    </div>
  );
};
