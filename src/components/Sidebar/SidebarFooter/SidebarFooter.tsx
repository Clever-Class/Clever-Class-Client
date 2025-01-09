import React from 'react';
import styles from '../Sidebar.module.scss';

export const SidebarFooter = () => (
  <div className={styles.sidebarFooter}>
    <div className={styles.upgradeBox}>
      <div className={styles.avatar}></div>
      <p>Upgrade to Pro</p>
      <button>Upgrade</button>
    </div>
  </div>
);
