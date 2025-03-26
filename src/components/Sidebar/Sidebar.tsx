import React from 'react';
import {
  RiDashboardLine,
  RiTaskLine,
  RiSettingsLine,
  RiTeamLine,
  RiFileTextLine,
} from 'react-icons/ri';
import styles from './Sidebar.module.scss';
import { SidebarHeader } from './SidebarHeader/SidebarHeader';
import { SidebarContent } from './SidebarContent/SidebarContent';
import { SidebarFooter } from './SidebarFooter/SidebarFooter';
import classNames from 'classnames';
import { BotMessageSquare, Dices } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  isVisible?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobile = false,
  isVisible = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: RiDashboardLine, route: '/dashboard' },
    {
      name: 'AI Chatbot',
      icon: BotMessageSquare,
      route: '/dashboard/ai-chatbot',
    },
    {
      name: 'Quiz Builder',
      icon: Dices,
      route: '/dashboard/quiz-builder',
    },
    {
      name: 'Quick Notes',
      icon: RiFileTextLine,
      route: '/dashboard/quick-notes',
    },
    { name: 'Tasks', icon: RiTaskLine, route: '/dashboard/tasks' },
    { name: 'Team', icon: RiTeamLine, route: '/dashboard/team' },
    { name: 'Settings', icon: RiSettingsLine, route: '/dashboard/settings' },
  ];

  // Find active menu item based on current route
  const activeItem =
    menuItems.find((item) => {
      if (item.route === '/dashboard') {
        return location.pathname === '/dashboard';
      }
      return location.pathname.startsWith(item.route);
    })?.name || 'Dashboard';

  const handleItemClick = (itemName: string, route: string) => {
    navigate(route);
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <>
      {isMobile && (
        <div
          className={classNames(styles.overlay, {
            [styles.visible]: isVisible,
          })}
          onClick={onToggle}
        />
      )}
      <aside
        className={classNames(styles.sidebar, {
          [styles.collapsed]: isCollapsed && !isMobile,
          [styles.visible]: isVisible,
        })}
      >
        <SidebarHeader isCollapsed={isCollapsed} toggleCollapse={onToggle} />
        <SidebarContent
          onItemClick={handleItemClick}
          menuItems={menuItems}
          activeItem={activeItem}
          isCollapsed={isCollapsed}
        />
        {(!isCollapsed || isMobile) && <SidebarFooter />}
      </aside>
    </>
  );
};
