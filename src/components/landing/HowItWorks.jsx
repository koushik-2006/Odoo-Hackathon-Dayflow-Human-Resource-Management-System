import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, SlidersHorizontal, Sparkles } from 'lucide-react';
import BorderGlow from '../ui/BorderGlow';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Sign In',
      description: 'Employees and administrators securely access their dedicated workspace.',
      icon: LogIn,
      badge: 'Secure Login',
      glowColor: '250 80 80',
      colors: ['#818cf8', '#6366f1', '#a855f7'],
    },
    {
      number: '02',
      title: 'Manage',
      description: 'Track attendance, manage leave, view payroll, and update employee information.',
      icon: SlidersHorizontal,
      badge: 'Unified Controls',
      glowColor: '280 80 80',
      colors: ['#c084fc', '#f472b6', '#818cf8'],
    },
    {
      number: '03',
      title: 'Flow',
      description: 'Everything stays connected in one simple HR workspace.',
      icon: Sparkles,
      badge: 'Seamless Output',
      glowColor: '190 85 80',
      colors: ['#38bdf8', '#34d399', '#6366f1'],
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-transparent border-t border-slate-800/80 relative text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
            ✨ Three Simple Steps
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Simple from day one.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Get your entire organization up and running in minutes with no steep learning curve.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <BorderGlow
                  borderRadius={24}
                  backgroundColor="rgba(15, 23, 42, 0.85)"
                  glowColor={step.glowColor}
                  colors={step.colors}
                  glowRadius={40}
                  edgeSensitivity={25}
                  className="h-full group"
                >
                  <div className="p-8 flex flex-col justify-between h-full space-y-6">
                    <div>
                      {/* Step Number & Icon Header */}
                      <div className="flex items-center justify-between mb-8">
                        <span className="text-4xl font-extrabold font-mono text-indigo-400/40 group-hover:text-indigo-300 transition-colors">
                          {step.number}
                        </span>
                        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 text-indigo-400 group-hover:bg-gradient-to-tr group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Step Title & Description */}
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-300 text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Phase {step.number}
                      </span>
                      <span className="text-xs font-medium text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/30">
                        {step.badge}
                      </span>
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
