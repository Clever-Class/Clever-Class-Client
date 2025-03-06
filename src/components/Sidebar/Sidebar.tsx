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

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: RiDashboardLine, route: '/dashboard' },
    {
      name: 'AI Chatbot',
      icon: BotMessageSquare,
      route: '/dashboard/ai-chatbot',
    },
    { name: 'Tasks', icon: RiTaskLine, route: '/dashboard/tasks' },
    { name: 'Calendar', icon: RiCalendarLine, route: '/dashboard/calendar' },
    { name: 'Team', icon: RiTeamLine, route: '/dashboard/team' },
    { name: 'Settings', icon: RiSettingsLine, route: '/dashboard/settings' },
  ];

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
      <SidebarHeader isCollapsed={isCollapsed} toggleCollapse={onToggle} />
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
