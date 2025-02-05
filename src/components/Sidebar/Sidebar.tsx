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
import { BotMessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: RiDashboardLine, route: '/dashboard' },
    { name: 'AI Chatbot', icon: BotMessageSquare, route: '/ai-chatbot' },
    { name: 'Tasks', icon: RiTaskLine, route: '/tasks' },
    { name: 'Calendar', icon: RiCalendarLine, route: '/calendar' },
    { name: 'Team', icon: RiTeamLine, route: '/team' },
    { name: 'Settings', icon: RiSettingsLine, route: '/settings' },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (itemName: string, route: string) => {
    setActiveItem(itemName);
    navigate(route);
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
        onItemClick={handleItemClick}
        menuItems={menuItems}
        activeItem={activeItem}
        isCollapsed={isCollapsed}
      />
      {!isCollapsed && <SidebarFooter />}
    </aside>
  );
};
