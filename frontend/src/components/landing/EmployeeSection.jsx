import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  User,
  Clock,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function EmployeeSection() {
  const benefits = [
    'View attendance history & daily hours',
    'Check real-time leave balances',
    'Request leave with instant manager routing',
    'Access monthly payroll & download payslips',
    'Update personal information & contact details',
  ];

  return (
    <section id="solutions" className="py-20 bg-white border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Realistic Employee Dashboard UI Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            {/* Subtle Gradient Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/15 rounded-3xl blur-2xl -z-10" />

            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
              
              {/* Employee Profile Header Widget */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">John Doe</h4>
                    <p className="text-xs text-slate-500 font-medium">Software Engineer • Product Dev</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Checked In
                </span>
              </div>

              {/* Attendance Quick Action Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="flex items-center text-slate-700">
                    <Clock className="w-4 h-4 mr-1.5 text-indigo-600" /> Daily Work Session
                  </span>
                  <span className="text-indigo-600 font-mono">06h 42m elapsed</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full w-[80%] rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">Check In: 09:00 AM</span>
                  <button className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors">
                    Check Out
                  </button>
                </div>
              </div>

              {/* Leave Balance Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Paid Leave</span>
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">12 / 18</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">6 Days Available</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Sick Leave</span>
                    <FileText className="w-3.5 h-3.5 text-violet-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">7 / 10</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">3 Days Available</div>
                </div>
              </div>

              {/* Payslip Quick View Strip */}
              <div className="bg-indigo-950 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
                <div>
                  <div className="text-xs text-indigo-300 font-medium">Latest Payslip (August 2026)</div>
                  <div className="text-lg font-bold text-white mt-0.5">$6,200.00</div>
                </div>
                <button className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm">
                  Download PDF
                </button>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Text & Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
              FOR EMPLOYEES
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Everything employees need, without the complexity.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Employees get a simple workspace to manage their day, track attendance, request leave, view payroll information, and keep their profile updated.
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {benefits.map((item) => (
                <div key={item} className="flex items-start space-x-3">
                  <div className="mt-0.5 p-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700 font-medium text-base">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore Employee Portal
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
