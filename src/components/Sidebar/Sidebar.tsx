import React, { useState } from 'react';
import {
  LayoutGrid,
  TrendingUp,
  FileText,
  ShoppingBag,
  Package,
  MessageSquare,
  Smartphone,
  Send,
  HelpCircle,
  ToggleLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './Sidebar.scss';

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  text,
  isActive = false,
}) => (
  <div className={`menu-item ${isActive ? 'active' : ''}`}>
    {icon}
    <span className="item-text">{text}</span>
  </div>
);

const LeftPanel: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`left-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="panel-content">
        <div className="panel-header">
          <div className="logo-container">
            <div className="logo" />
            <span className="brand-name">Consist</span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="collapse-button"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <div className="menu-section">
          <p className="section-title">MAIN MENU</p>
          <MenuItem
            icon={<LayoutGrid size={20} />}
            text="Overview"
            isActive={true}
          />
          <MenuItem icon={<TrendingUp size={20} />} text="Performance" />
          <MenuItem icon={<FileText size={20} />} text="Campaigns" />
          <MenuItem icon={<ShoppingBag size={20} />} text="Orders" />
          <MenuItem icon={<Package size={20} />} text="Products" />
          <MenuItem icon={<MessageSquare size={20} />} text="Message" />
          <MenuItem icon={<Smartphone size={20} />} text="Sales Platform" />
        </div>
      </div>

      <div className="panel-footer">
        <div className="demo-mode">
          <span>Demo Mode</span>
          <ToggleLeft size={20} />
        </div>
        <MenuItem icon={<Send size={20} />} text="Feedback" />
        <MenuItem icon={<HelpCircle size={20} />} text="Help and docs" />
        <div className="upgrade-box">
          <div className="avatar"></div>
          <p>Get detailed analytics for help you, upgrade pro</p>
          <button>Upgrade Now</button>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
