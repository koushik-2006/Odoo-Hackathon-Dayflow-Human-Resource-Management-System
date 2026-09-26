import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function AdminNavbar({ title }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    'EMP004 requested Leave (Pending)',
    'Payroll calculated for August 2026',
    '3 employees check-in late today'
  ];

  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">{title}</h1>
      </div>

      <div className="navbar-right">
        {/* Search placeholder */}
        <div className="nav-search-container">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Global search..." className="nav-search-input" />
        </div>

        {/* Notifications */}
        <div className="notification-wrapper">
          <button 
            className="navbar-icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="badge">3</span>
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">Notifications</div>
              <div className="dropdown-body">
                {notifications.map((n, i) => (
                  <div key={i} className="notification-item">{n}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin profile */}
        <div className="admin-profile-pill">
          <div className="avatar-container">
            <User size={16} />
          </div>
          <div className="profile-details">
            <span className="profile-name">Admin User</span>
            <span className="profile-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
