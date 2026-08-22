import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  CalendarDays,
  WalletCards,
  Bell,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Keep employee information organized and accessible from one central workspace.',
      badge: 'Core HR',
    },
    {
      icon: Clock,
      title: 'Attendance Tracking',
      description: 'Track check-ins, working hours, attendance history, and daily status with ease.',
      badge: 'Real-time',
    },
    {
      icon: CalendarDays,
      title: 'Leave Management',
      description: 'Employees can request leave while HR teams review and manage approvals effortlessly.',
      badge: 'Automated',
    },
    {
      icon: WalletCards,
      title: 'Payroll',
      description: 'Keep salary information, payroll summaries, and payslips organized and accessible.',
      badge: 'Secure',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Keep employees informed with timely updates, announcements, and reminders.',
      badge: 'Instant',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Give administrators clear insights into attendance, workforce activity, and HR operations.',
      badge: 'Insights',
    },
  ];

  return (
    <section id="features" className="py-20 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            Features Overview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Everything your team needs to work better.
          </h2>
          <p className="text-lg text-slate-300 font-normal">
            Powerful HR tools designed around the everyday employee experience.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-slate-900/70 backdrop-blur-md rounded-2xl p-8 border border-slate-800/80 hover:border-indigo-500/40 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center text-xs font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
