import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiHome,
  FiPlusSquare,
  FiDollarSign,
  FiUser,
  FiMail,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from 'react-icons/fi';
import styles from './Dashboard.module.css';

const SidebarMenu = ({ isOpen, collapsed, onClose, toggleCollapse }) => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        {!collapsed && <h2 className={styles.brand}>Menu</h2>}
        <div className={styles.sidebarControls}>
          <button onClick={toggleCollapse} className={styles.collapseButton}>
            {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX size={20} />
          </button>
        </div>
      </div>

      <nav className={styles.menuContainer}>
        <Link to="/dashboard" className={styles.menuItem} onClick={onClose}>
          <FiHome className={styles.menuIcon} />
          {!collapsed && <span>Dashboard</span>}
        </Link>
        <Link to="/dashboard/create-auction" className={styles.menuItem} onClick={onClose}>
          <FiPlusSquare className={styles.menuIcon} />
          {!collapsed && <span>Create Auction</span>}
        </Link>
        <Link to="/dashboard/participate" className={styles.menuItem} onClick={onClose}>
          <FiDollarSign className={styles.menuIcon} />
          {!collapsed && <span>Participate</span>}
        </Link>
        <Link to="/dashboard/profile" className={styles.menuItem} onClick={onClose}>
          <FiUser className={styles.menuIcon} />
          {!collapsed && <span>Profile</span>}
        </Link>
        <Link to="/dashboard/Dashboardcontact" className={styles.menuItem} onClick={onClose}>
          <FiMail className={styles.menuIcon} />
          {!collapsed && <span>Contact</span>}
        </Link>
      </nav>

      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <FiLogOut className={styles.menuIcon} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarMenu;