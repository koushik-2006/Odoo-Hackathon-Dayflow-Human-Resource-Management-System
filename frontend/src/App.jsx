import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Routes Guard Components
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import EmployeeRoute from './routes/EmployeeRoute';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Employee Pages (Koushik + Manoj)
import EmployeeDashboard from './pages/employee/Dashboard';
import Profile from './pages/employee/Profile';
import EmployeeAttendance from './pages/employee/Attendance';
import EmployeeLeave from './pages/employee/Leave';
import EmployeePayroll from './pages/employee/Payroll';
import EmployeeNotifications from './pages/employee/Notifications';

// Admin & HR Pages (Mukesh + Manoj)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEmployees from './pages/admin/Employees';
import EmployeeDetails from './pages/admin/EmployeeDetails';
import AdminAttendance from './pages/admin/AdminAttendance';
import LeaveRequests from './pages/admin/AdminLeaves';
import AdminPayroll from './pages/admin/AdminPayroll';
import AdminNotifications from './pages/admin/Notifications';

// Public Landing Page
import Landing from './pages/Landing';

function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (role === 'hr') {
    return <Navigate to="/hr/dashboard" replace />;
  }
  return <Navigate to="/employee/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Landing Page Route */}
            <Route path="/" element={<Landing />} />

            {/* Public Authentication Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected Employee Workspace Routes (/employee/*) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<EmployeeRoute />}>
                <Route element={<EmployeeLayout />}>
                  <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                  <Route path="/employee/profile" element={<Profile />} />
                  <Route path="/employee/attendance" element={<EmployeeAttendance />} />
                  <Route path="/employee/leave" element={<EmployeeLeave />} />
                  <Route path="/employee/payroll" element={<EmployeePayroll />} />
                  <Route path="/employee/notifications" element={<EmployeeNotifications />} />
                </Route>
              </Route>
            </Route>

            {/* Protected Admin Workspace Routes (/admin/*) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/employees" element={<AdminEmployees />} />
                  <Route path="/admin/employee/:id" element={<EmployeeDetails />} />
                  <Route path="/admin/attendance" element={<AdminAttendance />} />
                  <Route path="/admin/leaves" element={<LeaveRequests />} />
                  <Route path="/admin/leave-requests" element={<LeaveRequests />} />
                  <Route path="/admin/payroll" element={<AdminPayroll />} />
                  <Route path="/admin/notifications" element={<AdminNotifications />} />
                </Route>
              </Route>
            </Route>

            {/* Protected HR Workspace Routes (/hr/*) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/hr/dashboard" element={<AdminDashboard />} />
                  <Route path="/hr/employees" element={<AdminEmployees />} />
                  <Route path="/hr/employee/:id" element={<EmployeeDetails />} />
                  <Route path="/hr/attendance" element={<AdminAttendance />} />
                  <Route path="/hr/leave-requests" element={<LeaveRequests />} />
                  <Route path="/hr/payroll" element={<AdminPayroll />} />
                  <Route path="/hr/notifications" element={<AdminNotifications />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
