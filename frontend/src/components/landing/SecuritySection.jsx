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
    <section id="security" className="py-20 bg-transparent border-t border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            SECURITY & RELIABILITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built with security and control in mind.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Dayflow is designed to protect organization data while keeping access smooth and straightforward.
          </p>
        </div>

        {/* Security Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 shadow-xl space-y-4 hover:border-indigo-500/40 transition-all"
              >
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
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
