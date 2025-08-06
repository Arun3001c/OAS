import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome,
  FiPlusSquare,
  FiDollarSign,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut
} from 'react-icons/fi';
// import "react-pro-sidebar/dist/css/react-pro-sidebar.css";
// import 'react-pro-sidebar/dist/styles.css';
import styles from './Dashboard.module.css';

const SidebarMenu = ({ collapsed, isMobileOpen, onCollapse }) => {
  const location = useLocation();

  return (
    <Sidebar 
      collapsed={collapsed}
      toggled={isMobileOpen}
      onToggle={() => onCollapse(!collapsed)}
      breakPoint="md"
      width="250px"
      collapsedWidth="80px"
      className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}
    >
      <div className={styles.sidebarHeader}>
        <button 
          onClick={() => onCollapse(!collapsed)}
          className={styles.collapseButton}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
        {!collapsed && <h3>AuctionHub</h3>}
      </div>

      <Menu iconShape="square" popperArrow={true}>
        <MenuItem 
          icon={<FiHome />}
          active={location.pathname === '/dashboard'}
          component={<Link to="/dashboard" className={styles.menuLink} />}
        >
          Dashboard
        </MenuItem>
        <MenuItem 
          icon={<FiPlusSquare />}
          active={location.pathname === '/dashboard/create-auction'}
          component={<Link to="/dashboard/create-auction" className={styles.menuLink} />}
        >
          Create Auction
        </MenuItem>
        <MenuItem 
          icon={<FiDollarSign />}
          active={location.pathname === '/dashboard/participate'}
          component={<Link to="/dashboard/participate" className={styles.menuLink} />}
        >
          Participate
        </MenuItem>
        <MenuItem 
          icon={<FiUser />}
          active={location.pathname === '/dashboard/profile'}
          component={<Link to="/dashboard/profile" className={styles.menuLink} />}
        >
          Profile
        </MenuItem>
      </Menu>

      <div className={styles.sidebarFooter}>
        <button 
          onClick={() => {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }}
          className={styles.logoutButton}
          aria-label="Logout"
        >
          <FiLogOut />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </Sidebar>
  );
};

export default SidebarMenu;