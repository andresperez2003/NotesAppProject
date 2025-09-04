import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/Layout.css';

interface LayoutProps {
  userRole: string;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ userRole, userName }) => {

  
  return (
    <div className="layout">
      <Sidebar 
        userRole={userRole}
        userName={userName}
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
