import React from 'react';
import { MenuItem } from '../MenuItem/MenuItem';
import { MenuItemType } from '../types';
import styles from '../Sidebar.module.scss';

interface SidebarContentProps {
  menuItems: MenuItemType[];
  activeItem: string;
  isCollapsed: boolean;
  onItemClick: (itemName: string) => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  menuItems,
  activeItem,
  isCollapsed,
  onItemClick,
}) => (
  <div className={styles.sidebarContent}>
    {menuItems.map((item) => (
      <MenuItem
        Icon={item.icon}
        key={item.name}
        {...item}
        isActive={activeItem === item.name}
        isCollapsed={isCollapsed}
        onClick={() => onItemClick(item.name)}
      />
    ))}
  </div>
);
