import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import SidebarMenu from './SidebarMenu';
import styles from './Dashboard.module.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.dashboardContainer}>
      <TopNavbar toggleSidebar={toggleSidebar} />
      
      <main className={styles.pageContent}>
        <Outlet />
      </main>

      <SidebarMenu 
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={closeSidebar}
        toggleCollapse={toggleCollapse}
      />

      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={closeSidebar} />
      )}
    </div>
  );
};

export default DashboardLayout;