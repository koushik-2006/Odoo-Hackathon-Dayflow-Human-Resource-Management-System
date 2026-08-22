import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Bell,
  Search,
  ChevronRight,
  Shield,
  Activity,
} from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-8 pb-16 lg:pt-16 lg:pb-28 overflow-hidden">
      {/* Background Decorator Grids & Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Subtle Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-transparent blur-3xl rounded-full" />
        
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"
        />

        {/* Decorative Blurred Floating Orbs */}
        <div className="absolute top-12 left-10 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>✨ Modern HR Management Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Your People.{' '}
              <span className="block sm:inline">Your Work.</span>{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent block sm:inline">
                One Simple Flow.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Dayflow brings attendance, leave, payroll, and employee management together in one beautifully simple workspace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <LayoutDashboard className="w-5 h-5 mr-2 text-indigo-600" />
                Explore Dashboard
              </Link>
            </div>

            {/* Subtext */}
            <div className="pt-3 flex items-center justify-center lg:justify-start space-x-2 text-xs sm:text-sm font-medium text-slate-500">
              <span>Built for</span>
              <span className="font-semibold text-slate-700">Employees</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">HR Teams</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">Administrators</span>
            </div>
          </motion.div>

          {/* Right Column - Realistic Interactive HTML/CSS SaaS Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6 relative"
          >
            {/* Soft Ambient Glow behind preview */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-3xl blur-2xl -z-10" />

            {/* Floating Frame */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden text-left"
            >
              {/* Browser Header Bar */}
              <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
                </div>
                <div className="bg-slate-800/80 px-3 py-1 rounded-md text-[11px] font-mono text-slate-300 flex items-center space-x-1.5 border border-slate-700/50">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>app.dayflow.io/dashboard</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Inner Dashboard Interface Mockup */}
              <div className="bg-slate-50 p-4 sm:p-5 grid grid-cols-12 gap-3 text-xs">
                
                {/* Mini Sidebar */}
                <div className="hidden sm:flex col-span-3 bg-white p-3 rounded-xl border border-slate-200/80 flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 px-1">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">D</div>
                      <span className="font-bold text-slate-800 text-xs">Dayflow</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Overview</span>
                      </div>
                      <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Directory</span>
                      </div>
                      <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Attendance</span>
                      </div>
                      <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Leave</span>
                      </div>
                      <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        <span>Payroll</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 bg-indigo-50/70 rounded-lg border border-indigo-100/60">
                    <div className="font-medium text-[11px] text-indigo-900">Live Status</div>
                    <div className="flex items-center space-x-1.5 text-[10px] text-emerald-600 font-semibold mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>98% Present</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="col-span-12 sm:col-span-9 space-y-3">
                  
                  {/* Top Bar inside app */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-400 text-[11px]">
                      <Search className="w-3 h-3" />
                      <span>Search employees, leave...</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="relative">
                        <Bell className="w-4 h-4 text-slate-500" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-600" />
                      </div>
                      <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-200">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center text-[10px]">
                          SJ
                        </div>
                        <span className="font-semibold text-slate-700 text-[11px]">Sarah J.</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stat Cards Row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="text-[10px] font-medium text-slate-500">Working Hours</div>
                      <div className="text-sm font-bold text-slate-900">38.5 hrs</div>
                      <div className="text-[9px] text-emerald-600 font-medium flex items-center">
                        <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +4% this week
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="text-[10px] font-medium text-slate-500">Leave Balance</div>
                      <div className="text-sm font-bold text-indigo-600">18 Days</div>
                      <div className="text-[9px] text-slate-400">14 Paid • 4 Casual</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="text-[10px] font-medium text-slate-500">Attendance</div>
                      <div className="text-sm font-bold text-emerald-600">On Time</div>
                      <div className="text-[9px] text-slate-500">Checked 09:14 AM</div>
                    </div>
                  </div>

                  {/* Attendance & Recent Activity Grid */}
                  <div className="grid grid-cols-12 gap-2">
                    {/* Mini Weekly Attendance Graph */}
                    <div className="col-span-7 bg-white p-3 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-[11px]">Weekly Attendance</span>
                        <span className="text-[9px] text-indigo-600 font-medium">This Week</span>
                      </div>
                      <div className="h-16 flex items-end justify-between gap-1.5 pt-2">
                        {[
                          { day: 'M', h: '85%', color: 'bg-indigo-500' },
                          { day: 'T', h: '95%', color: 'bg-indigo-600' },
                          { day: 'W', h: '90%', color: 'bg-indigo-500' },
                          { day: 'T', h: '100%', color: 'bg-violet-600' },
                          { day: 'F', h: '80%', color: 'bg-indigo-400' },
                        ].map((bar, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-slate-100 rounded-t-sm h-12 flex items-end overflow-hidden">
                              <div
                                className={`w-full ${bar.color} rounded-t-sm transition-all duration-500`}
                                style={{ height: bar.h }}
                              />
                            </div>
                            <span className="text-[9px] font-medium text-slate-400">{bar.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payroll Summary & Action */}
                    <div className="col-span-5 bg-white p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-medium text-slate-500">Net Salary (Aug)</div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">$5,850.00</div>
                        <div className="mt-1 flex items-center space-x-1 text-[9px] text-emerald-600 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Processed</span>
                        </div>
                      </div>
                      <button className="w-full py-1 bg-indigo-50 text-indigo-700 rounded-md font-semibold text-[10px] hover:bg-indigo-100 transition-colors">
                        View Payslip
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
