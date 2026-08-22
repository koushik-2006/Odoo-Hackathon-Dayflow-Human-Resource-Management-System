import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, Clock, Layers } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      value: '250+',
      label: 'Employees Managed',
      description: 'Capacity for growing teams',
      icon: Users,
    },
    {
      value: '99.9%',
      label: 'System Availability',
      description: 'Reliable cloud architecture',
      icon: ShieldCheck,
    },
    {
      value: '24/7',
      label: 'Access',
      description: 'Real-time portal availability',
      icon: Clock,
    },
    {
      value: '1',
      label: 'Unified Workspace',
      description: 'Attendance, leave & payroll',
      icon: Layers,
    },
  ];

  return (
    <section className="py-10 bg-slate-900/60 backdrop-blur-xl border-y border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center md:items-start p-4 rounded-xl hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-200 mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
