import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../Sidebar.module.scss';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  toggleCollapse,
}) => (
  <div className={styles.sidebarHeader}>
    <div className={styles.logoContainer}>
      <div className={styles.logo} />
      {!isCollapsed && <span className={styles.brandName}>Consist</span>}
    </div>
    <button onClick={toggleCollapse} className={styles.collapseButton}>
      {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
    </button>
  </div>
);
