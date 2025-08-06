import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarMenu from './SidebarMenu.jsx';
import TopNavbar from './TopNavbar';
import styles from './Dashboard.module.css';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleCollapse = (collapsed) => {
    if (!isMobile) {
      setSidebarCollapsed(collapsed);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <SidebarMenu 
        collapsed={isMobile ? false : sidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        onCollapse={handleCollapse}
      />
      <div className={`
        ${styles.mainContent} 
        ${sidebarCollapsed ? styles.sidebarCollapsed : ''}
        ${isMobile && mobileSidebarOpen ? styles.mobileSidebarOpen : ''}
      `}>
        <TopNavbar toggleSidebar={toggleSidebar} />
        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && mobileSidebarOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;