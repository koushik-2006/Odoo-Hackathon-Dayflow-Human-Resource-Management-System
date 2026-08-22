import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from './components/admin/AdminSidebar';
import AdminNavbar from './components/admin/AdminNavbar';
import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import EmployeeDetails from './pages/admin/EmployeeDetails';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminLeaves from './pages/admin/AdminLeaves';
import AdminPayroll from './pages/admin/AdminPayroll';

function MainAppShell() {
  const location = useLocation();

  // Dynamically set title depending on the path
  const getPageTitle = (pathname) => {
    if (pathname.includes('/admin/dashboard')) return 'Admin Dashboard';
    if (pathname.includes('/admin/employees/')) return 'Employee Profile Details';
    if (pathname.includes('/admin/employees')) return 'Employee Directory';
    if (pathname.includes('/admin/attendance')) return 'Workforce Attendance';
    if (pathname.includes('/admin/leaves')) return 'Leave Request Inbox';
    if (pathname.includes('/admin/payroll')) return 'Payroll & Salary Management';
    return 'Admin Panel';
  };

  return (
    <div className="app-container">
      <AdminSidebar />
      <div className="main-wrapper">
        <AdminNavbar title={getPageTitle(location.pathname)} />
        <main className="admin-main-content">
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/employees/:id" element={<EmployeeDetails />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/leaves" element={<AdminLeaves />} />
            <Route path="/admin/payroll" element={<AdminPayroll />} />
            
            {/* Redirect root to dashboard for convenience */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainAppShell />
    </Router>
  );
}
