import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileSpreadsheet, 
  CreditCard, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function AdminSidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { name: 'Leave Requests', path: '/admin/leaves', icon: FileSpreadsheet },
    { name: 'Payroll', path: '/admin/payroll', icon: CreditCard },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">🌌</div>
        <h2>HR SYSTEM</h2>
      </div>

      <div className="sidebar-section-title">ADMIN PANEL</div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/admin/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} className="nav-icon" />
          <span>Settings</span>
        </NavLink>
        <button className="nav-item logout-btn" onClick={() => alert('Logout clicked')}>
          <LogOut size={20} className="nav-icon text-red" />
          <span className="text-red">Logout</span>
        </button>
      </div>
    </aside>
  );
}
