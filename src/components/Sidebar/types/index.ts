import { IconType } from 'react-icons/lib';
import { LucideIcon } from 'lucide-react';

// types.ts
export interface MenuItemType {
  name: string;
  icon: IconType | LucideIcon;
  route: string;
  onClick?: () => void;
}
