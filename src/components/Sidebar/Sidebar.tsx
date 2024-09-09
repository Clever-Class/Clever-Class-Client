import React, { useState, useCallback } from 'react';
import classNames from 'classnames';

import { SidebarHeader } from './SidebarHeader/SidebarHeader';
import { SidebarContent } from './SidebarContent/SidebarContent';
import { SidebarFooter } from './SidebarFooter/SidebarFooter';
import { MenuItemType } from './types';

import styles from './Sidebar.module.scss';

// icons import
import { GrHomeRounded, GrPerformance, GrOrderedList } from 'react-icons/gr';

export const DashboardSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('Overview');

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleItemClick = useCallback((itemName: string) => {
    setActiveItem(itemName);
  }, []);

  const sidebarClass = classNames(styles.sidebar, {
    [styles.collapsed]: isCollapsed,
  });

  const menuItems: MenuItemType[] = [
    { name: 'Overview', icon: GrHomeRounded },
    { name: 'Performance', icon: GrPerformance },
    { name: 'Orders', icon: GrOrderedList },
  ];

  return (
    <div className={sidebarClass}>
      <SidebarHeader
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />
      <SidebarContent
        menuItems={menuItems}
        activeItem={activeItem}
        isCollapsed={isCollapsed}
        onItemClick={handleItemClick}
      />
      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
};
