import React, { useState } from 'react';
import {
  RiDashboardLine,
  RiTaskLine,
  RiSettingsLine,
  RiTeamLine,
  RiCalendarLine,
} from 'react-icons/ri';
import styles from './Sidebar.module.scss';
import { SidebarHeader } from './SidebarHeader/SidebarHeader';
import { SidebarContent } from './SidebarContent/SidebarContent';
import { SidebarFooter } from './SidebarFooter/SidebarFooter';
import classNames from 'classnames';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: RiDashboardLine },
    { name: 'Tasks', icon: RiTaskLine },
    { name: 'Calendar', icon: RiCalendarLine },
    { name: 'Team', icon: RiTeamLine },
    { name: 'Settings', icon: RiSettingsLine },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={classNames(styles.sidebar, {
        [styles.collapsed]: isCollapsed,
      })}
    >
      <SidebarHeader
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />
      <SidebarContent
        menuItems={menuItems}
        activeItem={activeItem}
        isCollapsed={isCollapsed}
        onItemClick={setActiveItem}
      />
      {!isCollapsed && <SidebarFooter />}
    </aside>
  );
};
