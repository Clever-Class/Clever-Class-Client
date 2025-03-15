import React from 'react';

import classNames from 'classnames';
import { IconType } from 'react-icons/lib';

import { MenuItemType } from '../types';
import styles from '../Sidebar.module.scss';

interface MenuItemProps extends MenuItemType {
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  Icon: IconType;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  name,
  Icon,
  isActive,
  isCollapsed,
  onClick,
}) => {
  const itemClass = classNames(styles.menuItem, {
    [styles.active]: isActive,
  });

  return (
    <div className={itemClass} onClick={onClick}>
      <div className={styles.iconContainer}>
        <Icon size={20} />
      </div>
      {<span className={styles.itemText}>{name}</span>}
    </div>
  );
};
