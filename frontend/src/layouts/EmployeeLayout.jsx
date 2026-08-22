import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { ROLES } from '../utils/constants';

export default function EmployeeLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname.includes('/profile')) return 'My Profile';
    if (pathname.includes('/attendance')) return 'Attendance & Clock-In';
    if (pathname.includes('/leave')) return 'Leave Management';
    if (pathname.includes('/payroll')) return 'Payroll & Payslips';
    if (pathname.includes('/notifications')) return 'Notifications';
    return 'Employee Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex selection:bg-indigo-500 selection:text-white">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar
          role={ROLES.EMPLOYEE}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Drawer Overlay & Sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative z-10 w-64">
            <Sidebar
              role={ROLES.EMPLOYEE}
              isCollapsed={false}
              onCloseMobile={() => setIsMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <Navbar
          onToggleMobileSidebar={() => setIsMobileOpen(true)}
          pageTitle={getPageTitle(location.pathname)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
