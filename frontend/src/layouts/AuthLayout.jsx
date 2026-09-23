import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Sparkles, ShieldCheck, Clock, Award, ArrowLeft } from 'lucide-react';
import SpecularButton from '../components/ui/SpecularButton';
import WarpText from '../components/ui/WarpText';
import BorderGlow from '../components/ui/BorderGlow';

export default function AuthLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Mobile Header Bar with Back to Home button */}
      <div className="lg:hidden p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base leading-none">Dayflow</span>
            <span className="block text-[9px] font-semibold text-indigo-400 uppercase tracking-wider leading-tight">HR Suite</span>
          </div>
        </Link>

        <SpecularButton
          size="sm"
          radius={10}
          baseColor="#1e293b"
          lineColor="#64748b"
          textColor="#f8fafc"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 text-indigo-400" />
          Home
        </SpecularButton>
      </div>

      {/* Left Visual Hero Banner */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative z-10 border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
        <div className="space-y-6">
          {/* Back to Home Specular Button */}
          <div>
            <SpecularButton
              size="sm"
              radius={12}
              baseColor="#1e293b"
              lineColor="#64748b"
              textColor="#f8fafc"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 text-indigo-400" />
              Back to Home
            </SpecularButton>
          </div>

          {/* Clickable Dayflow HR Management Suite Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer w-fit transition-opacity hover:opacity-90">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-300 bg-clip-text text-transparent group-hover:text-indigo-300 transition-colors">
                Dayflow
              </span>
              <span className="block text-[11px] font-semibold text-indigo-400 uppercase tracking-widest group-hover:text-indigo-300 transition-colors">
                HR Management Suite
              </span>
            </div>
          </Link>
        </div>

        {/* Hero Copy with WebGL WarpText Animation */}
        <div className="max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Workforce Experience
          </div>

          {/* Interactive WebGL WarpText Headline Animation */}
          <div className="relative py-2 min-h-[160px]">
            <WarpText
              text={"Streamline your HR,\npayroll, attendance,\nand leave management"}
              color="#ffffff"
              warpStrength={0.06}
              warpScale={1.5}
              speed={0.45}
              pointerInfluence={0.4}
              pointerStrength={0.35}
              refraction={0.015}
              fontSize="clamp(1.6rem, 2.8vw, 2.5rem)"
              fontWeight={800}
              letterSpacing="-0.03em"
              lineHeight={1.1}
            />
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Empower employees and administrative leaders with real-time tracking, seamless profile updates, automated payroll processing, and instant requests.
          </p>

          {/* Feature Highlights wrapped in BorderGlow */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <BorderGlow
              borderRadius={18}
              backgroundColor="rgba(15, 23, 42, 0.85)"
              glowColor="250 80 80"
              colors={['#818cf8', '#6366f1', '#a855f7']}
              glowRadius={25}
              edgeSensitivity={20}
            >
              <div className="p-4 space-y-2">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                <p className="text-xs font-bold text-slate-200">Role Security</p>
                <p className="text-[11px] text-slate-400">JWT Role Guards</p>
              </div>
            </BorderGlow>

            <BorderGlow
              borderRadius={18}
              backgroundColor="rgba(15, 23, 42, 0.85)"
              glowColor="280 80 80"
              colors={['#c084fc', '#f472b6', '#818cf8']}
              glowRadius={25}
              edgeSensitivity={20}
            >
              <div className="p-4 space-y-2">
                <Clock className="w-6 h-6 text-purple-400" />
                <p className="text-xs font-bold text-slate-200">Attendance</p>
                <p className="text-[11px] text-slate-400">Real-time Clocking</p>
              </div>
            </BorderGlow>

            <BorderGlow
              borderRadius={18}
              backgroundColor="rgba(15, 23, 42, 0.85)"
              glowColor="160 80 80"
              colors={['#34d399', '#10b981', '#38bdf8']}
              glowRadius={25}
              edgeSensitivity={20}
            >
              <div className="p-4 space-y-2">
                <Award className="w-6 h-6 text-emerald-400" />
                <p className="text-xs font-bold text-slate-200">Automated</p>
                <p className="text-[11px] text-slate-400">Instant Payslips</p>
              </div>
            </BorderGlow>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} Dayflow Enterprise System. All rights reserved.
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
