import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import LightTunnel from '../components/ui/LightTunnel';
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
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      {/* Interactive WebGL Light Tunnel Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <LightTunnel
          cableColor="#818CF8"
          pulseColor="#C084FC"
          tunnelColor="#4F46E5"
          tunnelOpacity={0.08}
          speed={0.08}
          pulseSpeed={1.5}
          cableCount={18}
          glow={1.2}
          mouseInteraction={true}
          mouseStrength={0.12}
        />
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:block shrink-0 h-full relative z-10">
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
          <div className="relative z-10 w-64 h-full">
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
        className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10 transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <Navbar
          onToggleMobileSidebar={() => setIsMobileOpen(true)}
          pageTitle={getPageTitle(location.pathname)}
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
