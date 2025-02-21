import React from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from '../Sidebar.module.scss';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  toggleCollapse,
}) => {
  return (
    <div className={styles.sidebarHeader}>
      <div className={styles.logoContainer}>
        <div className={styles.logo} />
        {!isCollapsed && <span className={styles.brandName}>Clever Class</span>}
      </div>
      <button
        onClick={toggleCollapse}
        className={styles.collapseButton}
        aria-label="Toggle sidebar"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
};
