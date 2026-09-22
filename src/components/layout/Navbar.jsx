import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Badge from '../ui/Badge';
import { ROLES } from '../../utils/constants';

export default function Navbar({ onToggleMobileSidebar, pageTitle = 'Dashboard' }) {
  const { currentUser, role, logout, updateUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const toggleDemoRole = () => {
    const nextRole = role === ROLES.ADMIN ? ROLES.EMPLOYEE : ROLES.ADMIN;
    updateUser({
      role: nextRole,
      name: nextRole === ROLES.ADMIN ? 'Sarah Connor (Admin)' : 'Alex Mercer',
      designation: nextRole === ROLES.ADMIN ? 'HR Director' : 'Senior Frontend Engineer',
      department: nextRole === ROLES.ADMIN ? 'Human Resources' : 'Engineering',
      avatar:
        nextRole === ROLES.ADMIN
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    addToast(`Switched demo context to ${nextRole.toUpperCase()} mode`, 'success');
    navigate(nextRole === ROLES.ADMIN ? '/admin/dashboard' : '/employee/dashboard');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: Mobile menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-100 tracking-tight hidden sm:block">
          {pageTitle}
        </h2>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center max-w-md w-full relative mx-4">
        <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search employees, documents, requests..."
          className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-500"
        />
      </div>

      {/* Right Section: Role Switcher Demo, Notifications, Profile Pill */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Role Quick-Switch Demo Button */}
        <button
          onClick={toggleDemoRole}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all shadow-sm"
          title="Toggle between Admin and Employee viewing modes for local preview"
        >
          {role === ROLES.ADMIN ? (
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          ) : (
            <UserCheck className="w-4 h-4 text-indigo-400" />
          )}
          <span>Role: <strong className="uppercase text-white">{role}</strong></span>
        </button>

        {/* Notifications Icon */}
        <NavLink
          to={role === ROLES.ADMIN ? '/admin/notifications' : '/employee/notifications'}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-xl transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
        </NavLink>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors focus:outline-none"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-200 leading-tight">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {currentUser?.role || 'Employee'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="p-3 border-b border-slate-800/80 mb-1">
                <p className="text-xs font-bold text-slate-100">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser?.email}</p>
                <div className="mt-2">
                  <Badge variant={role === ROLES.ADMIN ? 'purple' : 'indigo'} size="sm">
                    {role}
                  </Badge>
                </div>
              </div>

              <NavLink
                to="/employee/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>My Profile</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 rounded-xl transition-colors mt-1"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
