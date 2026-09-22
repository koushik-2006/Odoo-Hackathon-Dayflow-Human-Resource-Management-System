import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  FileText,
  DollarSign,
  Bell,
  Users,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../utils/constants';

export default function Sidebar({
  role = 'employee',
  isCollapsed = false,
  onToggleCollapse,
  onCloseMobile,
}) {
  const { logout, currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const employeeNav = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/employee/profile', icon: User },
    { name: 'Attendance', path: '/employee/attendance', icon: CalendarCheck },
    { name: 'Leave Tracker', path: '/employee/leave', icon: FileText },
    { name: 'Payroll', path: '/employee/payroll', icon: DollarSign },
    { name: 'Notifications', path: '/employee/notifications', icon: Bell, badge: '3' },
  ];

  const adminNav = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { name: 'Leave Requests', path: '/admin/leave-requests', icon: ClipboardList, badge: '5' },
    { name: 'Payroll', path: '/admin/payroll', icon: DollarSign },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell, badge: '2' },
  ];

  const navItems = role === ROLES.ADMIN || role === ROLES.HR ? adminNav : employeeNav;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-2xl ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header / Brand Logo */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <NavLink
          to={role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-300 bg-clip-text text-transparent">
                Dayflow
              </h1>
              <span className="text-[10px] font-semibold tracking-widest text-indigo-400 uppercase">
                {role === 'admin' || role === 'hr' ? 'Admin Portal' : 'Workspace'}
              </span>
            </div>
          )}
        </NavLink>

        {/* Toggle Collapse Button (Desktop) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}

              {item.badge && !isCollapsed && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
              {item.badge && isCollapsed && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Footer Card & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {!isCollapsed && currentUser && (
          <div className="p-2.5 mb-2 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
