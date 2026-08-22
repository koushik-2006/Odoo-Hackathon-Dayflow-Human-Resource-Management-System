import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, Cloud, Zap } from 'lucide-react';

export default function SecuritySection() {
  const trustItems = [
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Protected user sessions, token encryption, and safe credential handling.',
    },
    {
      icon: ShieldAlert,
      title: 'Role-Based Access',
      description: 'Granular permissions for Employees, HR Managers, and Administrators.',
    },
    {
      icon: Cloud,
      title: 'Centralized Data',
      description: 'Single source of truth for attendance, leave, and employee records.',
    },
    {
      icon: Zap,
      title: 'Reliable Performance',
      description: 'Fast response times, continuous uptime, and optimized frontend assets.',
    },
  ];

  return (
    <section id="security" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            SECURITY & RELIABILITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built with security and control in mind.
          </h2>
          <p className="text-slate-600 text-base">
            Designed to safeguard employee data and ensure seamless operational continuity.
          </p>
        </div>

        {/* 4 Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:bg-white hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center mb-4 transition-all duration-300 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
