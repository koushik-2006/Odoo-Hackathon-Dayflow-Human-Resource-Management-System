import React from 'react';

export default function AdminLayout({ children, currentTitle }) {
  return (
    <div className="admin-layout-container">
      {/* Sidebar is handled by App.jsx or router tree */}
      <div className="admin-main-content">
        {children}
      </div>
    </div>
  );
}
