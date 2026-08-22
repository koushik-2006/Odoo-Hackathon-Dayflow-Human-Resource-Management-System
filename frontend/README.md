# Dayflow Frontend — HR & Employee Management System

Welcome to the **Dayflow Frontend** codebase (Person 1 Work Division).

## 🛠️ Stack & Technologies
- **React 18** (Vite)
- **Tailwind CSS v4** (Glassmorphic dark design system)
- **React Router DOM v6** (Role-based Protected Routes)
- **Axios** (Centralized API client with interceptors)
- **Lucide React** (Modern UI Icons)
- **Recharts** (Attendance & Headcount analytics charts)

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── assets/           # Logos & SVGs
│   ├── components/
│   │   ├── ui/           # Button, Input, Card, Badge, Table, Modal, Toast
│   │   ├── layout/       # Navbar, Sidebar
│   │   └── common/       # StatCard, Loader, EmptyState
│   ├── layouts/          # AuthLayout, EmployeeLayout, AdminLayout
│   ├── pages/
│   │   ├── auth/         # Login, Register, ForgotPassword
│   │   ├── employee/     # Dashboard, Profile, Attendance, Leave, Payroll, Notifications
│   │   └── admin/        # Dashboard, Employees, EmployeeDetails, Attendance, LeaveRequests, Payroll, Notifications
│   ├── services/         # api, authService, employeeService, attendanceService, leaveService, payrollService
│   ├── context/          # AuthContext, ToastContext
│   ├── routes/           # ProtectedRoute, AdminRoute, EmployeeRoute
│   ├── hooks/            # useAuth
│   ├── utils/            # formatters, constants
│   ├── App.jsx           # Main Router & Provider Tree
│   ├── main.jsx          # Entry point
│   └── index.css         # Glassmorphism design tokens & styles
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run Local Development Server
```bash
npm run dev
```

### 3. Key Demo Features & Quick Role Switcher
- Open the application in your browser.
- Use the **Role Preset Switcher** on the Sign-In page or top Navbar to instantly toggle between **Employee View** and **Admin View**.

---

## ⚡ Modules Implemented (Person 1)
- **Module 1**: Project setup, Tailwind CSS v4 design tokens, assets & folder structure.
- **Module 2**: Authentication context, Protected Routes (`<ProtectedRoute/>`, `<AdminRoute/>`, `<EmployeeRoute/>`), Login, Register, Forgot Password.
- **Module 3**: Shared layouts (`AuthLayout`, `EmployeeLayout`, `AdminLayout`), Navbar, Sidebar with role menus, full UI component system.
- **Module 4**: Employee Profile (`/employee/profile`) with header, personal info, job info, salary breakdown, and edit profile modal (`PUT /api/employees/me`).
