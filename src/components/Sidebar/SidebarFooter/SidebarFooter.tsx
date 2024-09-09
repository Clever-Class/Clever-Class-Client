import React from 'react';
import { ToggleLeft } from 'lucide-react';
import styles from '../Sidebar.module.scss';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isCollapsed,
}) => (
  <div className={styles.sidebarFooter}>
    <div className={styles.demoMode}>
      {!isCollapsed && <span>Demo Mode</span>}
      <ToggleLeft size={20} />
    </div>
    <div className={styles.upgradeBox}>
      <div className={styles.avatar}></div>
      {!isCollapsed && (
        <>
          <p>Upgrade to Pro</p>
          <button>Upgrade</button>
        </>
      )}
    </div>
  </div>
);
