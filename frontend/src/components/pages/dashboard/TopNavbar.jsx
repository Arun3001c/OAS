import React from 'react';
import { 
  FiHome,
  FiPlusSquare,
  FiDollarSign,
  FiUser,
  FiMail,
  FiMenu
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

const TopNavbar = ({ toggleSidebar }) => {
  return (
    <header className={styles.topNavbar}>
      <div className={styles.logo}>AuctionHub</div>

      <div className={styles.searchContainer}>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search auctions, items or users..."
        />
      </div>

      <div className={styles.mainNav}>
        <Link to="/dashboard" className={styles.navIcon}>
          <FiHome size={20} />
          <span>Home</span>
        </Link>
        <Link to="/dashboard/create-auction" className={styles.navIcon}>
          <FiPlusSquare size={20} />
          <span>Create</span>
        </Link>
        <Link to="/dashboard/participate" className={styles.navIcon}>
          <FiDollarSign size={20} />
          <span>Bid</span>
        </Link>
        <Link to="/dashboard/profile" className={styles.navIcon}>
          <FiUser size={20} />
          <span>Profile</span>
        </Link>
      </div>

      <button className={styles.menuButton} onClick={toggleSidebar}>
        <FiMenu size={24} />
      </button>
    </header>
  );
};

export default TopNavbar;