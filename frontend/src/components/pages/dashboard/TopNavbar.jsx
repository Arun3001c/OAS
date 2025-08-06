import React from 'react';
import { FiMenu } from 'react-icons/fi';
import styles from './Dashboard.module.css';

const TopNavbar = ({ toggleSidebar }) => {
  return (
    <nav className={styles.topNavbar}>
      <div className={styles.navContent}>
        <button 
          className={styles.mobileMenuToggle}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FiMenu size={20} />
        </button>
        
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search auctions..." />
        </div>
        
        <div className={styles.userProfile}>
          <span className={styles.userName}>user</span>
          <div className={styles.avatar}>img</div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;