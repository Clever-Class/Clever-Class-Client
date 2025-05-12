import React from 'react';
import { MenuItem } from '../MenuItem/MenuItem';
import { MenuItemType } from '../types';
import styles from '../Sidebar.module.scss';
import Cookies from 'js-cookie';
import { IconType } from 'react-icons/lib';

export interface SidebarContentProps {
  menuItems: MenuItemType[];
  activeItem: string;
  isCollapsed: boolean;
  onItemClick?: (itemName: string, route: string) => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  menuItems,
  activeItem,
  isCollapsed,
  onItemClick,
}) => {
  const handleLogout = () => {
    Cookies.remove('userToken');

    // Clear all localStorage items
    localStorage.clear();

    // Specifically ensure payment popup related items are cleared
    localStorage.removeItem('paymentPopupLastShown');
    localStorage.removeItem('paymentPopupSessionId');

    // Redirect to home page
    window.location.href = '/';
  };
  return (
    <div>
      <div className={styles.sidebarContent}>
        {menuItems.map((item) => (
          <MenuItem
            Icon={item.icon as IconType}
            key={item.name}
            {...item}
            isActive={activeItem === item.name}
            isCollapsed={isCollapsed}
            onClick={() => onItemClick?.(item.name, item.route)}
          />
        ))}
      </div>
      <div className={styles.logoutWrapper}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};
