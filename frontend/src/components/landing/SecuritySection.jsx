import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, Cloud, Zap } from 'lucide-react';
import BorderGlow from '../ui/BorderGlow';

export default function SecuritySection() {
  const trustItems = [
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Protected user sessions, token encryption, and safe credential handling.',
      glowColor: '250 80 80',
      colors: ['#818cf8', '#6366f1', '#a855f7'],
    },
    {
      icon: ShieldAlert,
      title: 'Role-Based Access',
      description: 'Granular permissions for Employees, HR Managers, and Administrators.',
      glowColor: '280 80 80',
      colors: ['#c084fc', '#f472b6', '#818cf8'],
    },
    {
      icon: Cloud,
      title: 'Centralized Data',
      description: 'Single source of truth for attendance, leave, and employee records.',
      glowColor: '190 80 80',
      colors: ['#38bdf8', '#34d399', '#6366f1'],
    },
    {
      icon: Zap,
      title: 'Reliable Performance',
      description: 'Fast response times, continuous uptime, and optimized frontend assets.',
      glowColor: '40 90 75',
      colors: ['#fbbf24', '#f59e0b', '#818cf8'],
    },
  ];

  return (
    <section id="security" className="py-20 bg-transparent border-t border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
            ✨ SECURITY & RELIABILITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built with security and control in mind.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Dayflow is designed to protect organization data while keeping access smooth and straightforward.
          </p>
        </div>

        {/* Security Cards Grid with BorderGlow */}
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
              >
                <BorderGlow
                  borderRadius={20}
                  backgroundColor="rgba(15, 23, 42, 0.85)"
                  glowColor={item.glowColor}
                  colors={item.colors}
                  glowRadius={30}
                  edgeSensitivity={20}
                  className="h-full group"
                >
                  <div className="p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </BorderGlow>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
