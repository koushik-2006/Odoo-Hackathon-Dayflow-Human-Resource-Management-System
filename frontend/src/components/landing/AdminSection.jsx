import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  XCircle,
  BarChart,
  PieChart,
} from 'lucide-react';
import BorderGlow from '../ui/BorderGlow';
import SpecularButton from '../ui/SpecularButton';

export default function AdminSection() {
  const navigate = useNavigate();

  const adminFeatures = [
    'Comprehensive employee directory & profiles',
    'Real-time workforce attendance analytics',
    'One-click leave request approvals & history',
    'Streamlined payroll processing & salary records',
    'Actionable workforce operational insights',
  ];

  return (
    <section className="py-20 bg-transparent border-t border-slate-800/80 overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Admin Checklist */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-950/70 border border-violet-500/40 text-violet-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
              ✨ FOR HR & ADMINS
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              A smarter way to manage your workforce.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              HR managers and administrators gain complete visibility into employee records, real-time attendance logs, pending leave approvals, and payroll workflows.
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {adminFeatures.map((item) => (
                <div key={item} className="flex items-start space-x-3">
                  <div className="mt-0.5 p-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-slate-200 font-medium text-base">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <SpecularButton
                size="lg"
                radius={16}
                baseColor="#7c3aed"
                lineColor="#c084fc"
                textColor="#ffffff"
                onClick={() => navigate('/login')}
              >
                Explore Admin Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </SpecularButton>
            </div>
          </motion.div>

          {/* Right Column: Realistic Admin Analytics Dashboard Preview wrapped in BorderGlow */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            {/* Subtle Gradient Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/10 to-indigo-500/15 rounded-3xl blur-2xl -z-10" />

            <BorderGlow
              borderRadius={28}
              backgroundColor="rgba(15, 23, 42, 0.9)"
              glowColor="280 85 80"
              colors={['#c084fc', '#818cf8', '#f472b6']}
              glowRadius={45}
              edgeSensitivity={25}
            >
              <div className="p-6 sm:p-7 space-y-5 text-xs">
                
                {/* Stat Cards Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 font-medium">
                      <span>Total Staff</span>
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div className="text-xl font-extrabold text-white">248</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">+12 this month</div>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 font-medium">
                      <span>Present Today</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-xl font-extrabold text-white">232</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">93.5% Rate</div>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 font-medium">
                      <span>On Leave</span>
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-xl font-extrabold text-white">16</div>
                    <div className="text-[10px] text-slate-400 font-semibold">4 Pending</div>
                  </div>
                </div>

                {/* Attendance Chart & Department Breakdown */}
                <div className="grid grid-cols-12 gap-3">
                  
                  {/* Attendance Analytics Widget */}
                  <div className="col-span-7 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Monthly Attendance Rate</span>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center">
                        <TrendingUp className="w-3 h-3 mr-0.5" /> 95.8%
                      </span>
                    </div>

                    <div className="h-20 flex items-end justify-between gap-1.5 pt-2">
                      {[
                        { label: 'W1', val: '92%' },
                        { label: 'W2', val: '96%' },
                        { label: 'W3', val: '94%' },
                        { label: 'W4', val: '98%' },
                      ].map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-slate-800/80 rounded-t-md h-16 flex items-end overflow-hidden">
                            <div
                              className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-md"
                              style={{ height: bar.val }}
                            />
                          </div>
                          <span className="text-[9px] font-semibold text-slate-400">{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Department Distribution */}
                  <div className="col-span-5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
                    <span className="font-bold text-white block">Departments</span>
                    <div className="space-y-2">
                      {[
                        { name: 'Engineering', count: 110, color: 'bg-indigo-500' },
                        { name: 'Product & Design', count: 54, color: 'bg-violet-500' },
                        { name: 'Operations & HR', count: 42, color: 'bg-emerald-400' },
                        { name: 'Marketing', count: 42, color: 'bg-amber-400' },
                      ].map((dept) => (
                        <div key={dept.name} className="space-y-0.5">
                          <div className="flex justify-between text-[10px] text-slate-300 font-medium">
                            <span>{dept.name}</span>
                            <span className="font-bold text-white">{dept.count}</span>
                          </div>
                          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${dept.color}`}
                              style={{ width: `${(dept.count / 110) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Pending Leave Approvals Preview Widget */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Pending Leave Approvals (4)</span>
                    <span className="text-[10px] text-indigo-400 font-semibold hover:underline cursor-pointer">View All</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Alex Rivera', type: 'Annual Leave', dates: 'Aug 24 - Aug 28', status: 'Pending' },
                      { name: 'Emily Chen', type: 'Sick Leave', dates: 'Aug 25 (1 Day)', status: 'Pending' },
                    ].map((req, i) => (
                      <div key={i} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 font-bold flex items-center justify-center text-xs">
                            {req.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-xs">{req.name}</div>
                            <div className="text-[10px] text-slate-400">{req.type} • {req.dates}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <button className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/80 font-semibold text-[10px] rounded-lg transition-colors">
                            Approve
                          </button>
                          <button className="px-2.5 py-1 bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-[10px] rounded-lg transition-colors">
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </BorderGlow>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
