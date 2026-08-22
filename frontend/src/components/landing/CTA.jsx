import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, LogIn } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-r from-indigo-950/90 via-slate-900/95 to-purple-950/90 border border-indigo-500/30 backdrop-blur-xl rounded-3xl p-8 sm:p-12 lg:p-16 text-white text-center shadow-2xl overflow-hidden"
        >
          {/* Subtle Decorative Background Circles & Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Transform Your Workplace Today</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to simplify your HR workflow?
            </h2>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-indigo-100 font-normal leading-relaxed max-w-xl mx-auto">
              Bring employees, attendance, leave, and payroll together with Dayflow.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-indigo-900 bg-white hover:bg-indigo-50 shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-800/60 hover:bg-indigo-800/80 border border-white/20 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Link>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
