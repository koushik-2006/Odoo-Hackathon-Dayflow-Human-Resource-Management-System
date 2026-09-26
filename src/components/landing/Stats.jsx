import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, Clock, Layers } from 'lucide-react';
import BorderGlow from '../ui/BorderGlow';

export default function Stats() {
  const stats = [
    {
      value: '250+',
      label: 'Employees Managed',
      description: 'Capacity for growing teams',
      icon: Users,
      glowColor: '250 80 80',
      colors: ['#818cf8', '#6366f1', '#a855f7'],
    },
    {
      value: '99.9%',
      label: 'System Availability',
      description: 'Reliable cloud architecture',
      icon: ShieldCheck,
      glowColor: '160 80 80',
      colors: ['#34d399', '#10b981', '#38bdf8'],
    },
    {
      value: '24/7',
      label: 'Access',
      description: 'Real-time portal availability',
      icon: Clock,
      glowColor: '280 80 80',
      colors: ['#c084fc', '#f472b6', '#818cf8'],
    },
    {
      value: '1',
      label: 'Unified Workspace',
      description: 'Attendance, leave & payroll',
      icon: Layers,
      glowColor: '200 80 80',
      colors: ['#38bdf8', '#818cf8', '#6366f1'],
    },
  ];

  return (
    <section className="py-12 bg-slate-900/40 backdrop-blur-xl border-y border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BorderGlow
                  borderRadius={18}
                  backgroundColor="rgba(15, 23, 42, 0.85)"
                  glowColor={stat.glowColor}
                  colors={stat.colors}
                  glowRadius={30}
                  edgeSensitivity={20}
                  className="h-full"
                >
                  <div className="p-6 flex flex-col items-start justify-between h-full space-y-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-sm font-bold text-slate-200 mt-1">
                        {stat.label}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {stat.description}
                      </div>
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
