import React from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from '../Sidebar.module.scss';
import logo from '~/assets/images/logo.png';
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
        <img src={logo} alt="CleverClass Logo" className={styles.logo} />
        {!isCollapsed && <span className={styles.brandName}>Clever Class</span>}
      </div>
      <button
        onClick={toggleCollapse}
        className={styles.collapseButton}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
};
