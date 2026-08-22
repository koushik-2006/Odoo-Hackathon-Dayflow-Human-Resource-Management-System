import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Search,
  Bell,
  Download,
} from 'lucide-react';

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance Tracking', icon: Clock },
    { id: 'leave', label: 'Leave Management', icon: Calendar },
    { id: 'payroll', label: 'Payroll & Compensation', icon: DollarSign },
  ];

  return (
    <section id="dashboard-preview" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <span>💻 Interactive Platform Demo</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Designed for Clarity.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Built for Performance.
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-slate-300">
            Switch between modules to preview how Dayflow unifies your entire workforce workflow into one sleek, real-time dashboard.
          </p>

          {/* Tab Selection Switcher */}
          <div className="pt-4 flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-500/50'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/80 backdrop-blur-md'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Centered Browser Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-xl text-left"
        >
          {/* macOS Browser Top Bar */}
          <div className="bg-slate-950 px-5 py-3.5 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500/90" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500/90" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/90" />
            </div>
            <div className="bg-slate-900 px-4 py-1 rounded-md text-xs font-mono text-slate-300 flex items-center space-x-2 border border-slate-800">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>https://app.dayflow.io/{activeTab}</span>
            </div>
            <div className="w-16" />
          </div>

          {/* SaaS Interface Shell */}
          <div className="bg-slate-950/90 p-4 sm:p-6 lg:p-8 min-h-[480px]">
            
            {/* Top SaaS Header */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-500/30">
                  D
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-none">Dayflow Workspace</h3>
                  <p className="text-xs text-slate-400 mt-1 capitalize">{activeTab} View • Real-time Data</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    readOnly
                    placeholder="Search records, staff, payslips..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50 cursor-pointer">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center text-xs">
                    EA
                  </div>
                  <span className="font-semibold text-slate-200 text-xs hidden md:inline">Emma Adams</span>
                </div>
              </div>
            </div>

            {/* Dynamic Content Tab View */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* 4 KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90 shadow-md">
                    <div className="text-xs font-semibold text-slate-400">Total Workforce</div>
                    <div className="text-2xl font-extrabold text-white mt-1">248</div>
                    <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" /> +12 Active Users
                    </div>
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90 shadow-md">
                    <div className="text-xs font-semibold text-slate-400">Attendance Today</div>
                    <div className="text-2xl font-extrabold text-emerald-400 mt-1">94.8%</div>
                    <div className="text-xs text-slate-400 mt-1">235 Check-ins</div>
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90 shadow-md">
                    <div className="text-xs font-semibold text-slate-400">Pending Leave</div>
                    <div className="text-2xl font-extrabold text-amber-400 mt-1">5 Requests</div>
                    <div className="text-xs text-amber-400 mt-1 font-medium">Action Required</div>
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90 shadow-md">
                    <div className="text-xs font-semibold text-slate-400">Payroll Cycle</div>
                    <div className="text-2xl font-extrabold text-indigo-400 mt-1">$142,500</div>
                    <div className="text-xs text-emerald-400 mt-1 font-medium">Ready for August</div>
                  </div>
                </div>

                {/* Main Split: Attendance Graph & Recent Activity Feed */}
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-8 bg-slate-900/90 p-6 rounded-2xl border border-slate-800/90 shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">Attendance Trend (August 2026)</h4>
                        <p className="text-xs text-slate-400">Daily check-in volume vs target</p>
                      </div>
                      <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                        Daily Avg: 96%
                      </span>
                    </div>

                    <div className="h-44 flex items-end justify-between gap-3 pt-4 border-t border-slate-800/80">
                      {[
                        { day: 'Mon', count: '92%', height: '80%' },
                        { day: 'Tue', count: '98%', height: '96%' },
                        { day: 'Wed', count: '95%', height: '88%' },
                        { day: 'Thu', count: '99%', height: '98%' },
                        { day: 'Fri', count: '91%', height: '78%' },
                        { day: 'Sat', count: '85%', height: '65%' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full bg-slate-800/80 rounded-t-lg h-36 flex items-end overflow-hidden">
                            <div
                              className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg transition-all duration-700"
                              style={{ height: item.height }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-400">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800/90 shadow-md space-y-4">
                    <h4 className="font-bold text-white text-sm">Recent System Activity</h4>
                    <div className="space-y-3">
                      {[
                        { text: 'Sarah J. requested 2 days leave', time: '10 mins ago', type: 'leave' },
                        { text: 'August Payslips generated for Dev Team', time: '1 hour ago', type: 'payroll' },
                        { text: 'New employee Marcus Vance onboarded', time: '3 hours ago', type: 'user' },
                        { text: 'Check-in milestone: 95% on-time', time: '5 hours ago', type: 'check' },
                      ].map((act, i) => (
                        <div key={i} className="flex items-start space-x-3 text-xs border-b border-slate-800/80 pb-2.5 last:border-0 last:pb-0">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <div>
                            <div className="font-medium text-slate-200">{act.text}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{act.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800/90 shadow-md space-y-4 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <h4 className="font-bold text-white text-sm">Daily Attendance Log</h4>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold rounded-lg hover:bg-slate-700 transition-colors">
                      Filter Date
                    </button>
                    <button className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
                      Export Report
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800/80 text-[11px]">
                        <th className="pb-2 font-semibold">Employee</th>
                        <th className="pb-2 font-semibold">Status</th>
                        <th className="pb-2 font-semibold">Check In</th>
                        <th className="pb-2 font-semibold">Check Out</th>
                        <th className="pb-2 font-semibold">Total Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {[
                        { name: 'Sarah Jenkins', role: 'HR Lead', status: 'Present', in: '08:58 AM', out: '05:30 PM', hrs: '8.5 hrs' },
                        { name: 'David Miller', role: 'Backend Engineer', status: 'Present', in: '09:05 AM', out: '05:45 PM', hrs: '8.6 hrs' },
                        { name: 'Chloe Taylor', role: 'UX Designer', status: 'On Leave', in: '-', out: '-', hrs: '0.0 hrs' },
                        { name: 'Liam Wilson', role: 'Product Manager', status: 'Present', in: '09:12 AM', out: '05:15 PM', hrs: '8.0 hrs' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 font-semibold text-white">{row.name} <span className="text-[10px] text-slate-400 font-normal">({row.role})</span></td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${row.status === 'Present' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 font-mono">{row.in}</td>
                          <td className="py-3 font-mono">{row.out}</td>
                          <td className="py-3 font-semibold">{row.hrs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'leave' && (
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800/90 shadow-md space-y-4 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <h4 className="font-bold text-white text-sm">Leave Management & Approvals</h4>
                  <button className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
                    + Apply Leave
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Alex Rivera', type: 'Annual Vacation', days: 'Aug 24 - Aug 28 (5 Days)', reason: 'Family trip', status: 'Pending Review' },
                    { name: 'Sophia Chen', type: 'Medical Leave', days: 'Aug 26 (1 Day)', reason: 'Doctor appointment', status: 'Approved' },
                  ].map((req, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-800/80 bg-slate-800/40 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm">{req.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${req.status === 'Approved' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'}`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="text-slate-300">{req.type} • <span className="font-medium text-white">{req.days}</span></div>
                      <p className="text-slate-400 italic text-[11px]">"{req.reason}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payroll' && (
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800/90 shadow-md space-y-4 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <h4 className="font-bold text-white text-sm">August 2026 Payroll Summary</h4>
                  <button className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-colors flex items-center">
                    <Download className="w-3.5 h-3.5 mr-1" /> Export All Payslips
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                    <div className="text-slate-400 font-medium">Total Gross Payroll</div>
                    <div className="text-xl font-extrabold text-white mt-1">$178,200.00</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                    <div className="text-slate-400 font-medium">Tax & Deductions</div>
                    <div className="text-xl font-extrabold text-white mt-1">$35,700.00</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                    <div className="text-slate-400 font-medium">Net Disbursed</div>
                    <div className="text-xl font-extrabold text-indigo-400 mt-1">$142,500.00</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>

      </div>
    </section>
  );
}
