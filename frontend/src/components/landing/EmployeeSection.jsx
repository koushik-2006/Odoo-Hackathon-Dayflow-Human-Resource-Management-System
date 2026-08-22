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
    <section id="solutions" className="py-20 bg-transparent border-t border-slate-800/80 overflow-hidden text-white">
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

            <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800/90 shadow-2xl space-y-6">
              
              {/* Employee Profile Header Widget */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                    AM
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Alex Mercer</h4>
                    <p className="text-xs text-slate-400">Senior Frontend Engineer • Tech</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  Active
                </span>
              </div>

              {/* Attendance Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Paid Leave</span>
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-2">12 / 18</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">6 Days Available</div>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Sick Leave</span>
                    <FileText className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-2">7 / 10</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">3 Days Available</div>
                </div>
              </div>

              {/* Payslip Quick View Strip */}
              <div className="bg-indigo-950/90 border border-indigo-500/30 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
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
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              FOR EMPLOYEES
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Everything employees need, without the complexity.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Employees get a simple workspace to manage their day, track attendance, request leave, view payroll information, and keep their profile updated.
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {benefits.map((item) => (
                <div key={item} className="flex items-start space-x-3">
                  <div className="mt-0.5 p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-slate-200 font-medium text-base">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5"
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
