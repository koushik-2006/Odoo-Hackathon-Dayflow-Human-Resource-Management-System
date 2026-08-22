import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/employee/Dashboard';
import Attendance from './pages/employee/Attendance';
import Leave from './pages/employee/Leave';
import Payroll from './pages/employee/Payroll';
import { LayoutDashboard, Clock, Palmtree, CreditCard } from 'lucide-react';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
        {/* Navigation Bar for Local Module Testing */}
        <aside className="w-full md:w-64 bg-slate-900 text-white p-4 space-y-6 shrink-0 border-r border-slate-800">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white">D</div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white">Dayflow HRMS</h1>
              <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Employee Portal</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <Link
              to="/employee/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/employee/attendance"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Attendance</span>
            </Link>

            <Link
              to="/employee/leave"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Palmtree className="w-4 h-4 text-blue-400" />
              <span>Leave Management</span>
            </Link>

            <Link
              to="/employee/payroll"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Payroll</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />
            <Route path="/employee/dashboard" element={<Dashboard user={{ name: 'John Doe' }} />} />
            <Route path="/employee/attendance" element={<Attendance />} />
            <Route path="/employee/leave" element={<Leave />} />
            <Route path="/employee/payroll" element={<Payroll />} />
            <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
