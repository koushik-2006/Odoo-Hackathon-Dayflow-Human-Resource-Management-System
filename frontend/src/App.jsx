import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PageSkeleton from './components/common/PageSkeleton';

// Routes Guard Components
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import EmployeeRoute from './routes/EmployeeRoute';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';

// Eager Landing & Auth Pages for instant first paint
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Lazy-loaded Employee Pages (Koushik + Manoj)
const EmployeeDashboard = lazy(() => import('./pages/employee/Dashboard'));
const Profile = lazy(() => import('./pages/employee/Profile'));
const EmployeeAttendance = lazy(() => import('./pages/employee/Attendance'));
const EmployeeLeave = lazy(() => import('./pages/employee/Leave'));
const EmployeePayroll = lazy(() => import('./pages/employee/Payroll'));
const EmployeeNotifications = lazy(() => import('./pages/employee/Notifications'));

// Lazy-loaded Admin & HR Pages (Mukesh + Manoj)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminEmployees = lazy(() => import('./pages/admin/Employees'));
const EmployeeDetails = lazy(() => import('./pages/admin/EmployeeDetails'));
const AdminAttendance = lazy(() => import('./pages/admin/AdminAttendance'));
const LeaveRequests = lazy(() => import('./pages/admin/AdminLeaves'));
const AdminPayroll = lazy(() => import('./pages/admin/AdminPayroll'));
const AdminNotifications = lazy(() => import('./pages/admin/Notifications'));

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
          <Suspense fallback={<PageSkeleton />}>
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
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
