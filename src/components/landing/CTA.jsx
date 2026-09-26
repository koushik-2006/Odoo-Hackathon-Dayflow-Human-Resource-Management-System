import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, LogIn } from 'lucide-react';
import SpecularButton from '../ui/SpecularButton';

export default function CTA() {
  const navigate = useNavigate();

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

            {/* Action Buttons with Specular Light Effect */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <SpecularButton
                size="lg"
                radius={16}
                baseColor="#6366f1"
                lineColor="#ffffff"
                textColor="#ffffff"
                intensity={1.2}
                onClick={() => navigate('/register')}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </SpecularButton>
              
              <SpecularButton
                size="lg"
                radius={16}
                baseColor="#1e293b"
                lineColor="#64748b"
                textColor="#f8fafc"
                onClick={() => navigate('/login')}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </SpecularButton>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
