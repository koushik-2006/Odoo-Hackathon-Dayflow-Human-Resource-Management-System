import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CalendarDays,
  Clock3,
  IndianRupee,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  BellRing,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Inbox
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/employee/StatCard';
import ActivityItem from '../../components/employee/ActivityItem';

import { getMyAttendance } from '../../services/attendanceService';
import { getMyLeaves } from '../../services/leaveService';
import { getMyPayroll } from '../../services/payrollService';

// TODO: Replace mock data with API responses when backend endpoints are ready
const MOCK_ATTENDANCE_CHART_DATA = [
  { day: 'Mon', hours: 8.0, target: 8.0 },
  { day: 'Tue', hours: 8.5, target: 8.0 },
  { day: 'Wed', hours: 7.8, target: 8.0 },
  { day: 'Thu', hours: 8.2, target: 8.0 },
  { day: 'Fri', hours: 8.0, target: 8.0 },
];

const MOCK_RECENT_ACTIVITIES = [
  {
    id: 1,
    type: 'leave',
    title: 'Leave approved',
    description: 'Your leave request for Aug 25 was approved.',
    timestamp: 'Today, 9:30 AM',
  },
  {
    id: 2,
    type: 'attendance',
    title: 'Checked in',
    description: 'You checked in at 09:02 AM.',
    timestamp: 'Today, 9:02 AM',
  },
  {
    id: 3,
    type: 'profile',
    title: 'Profile updated',
    description: 'Your employee profile was updated.',
    timestamp: 'Yesterday',
  },
  {
    id: 4,
    type: 'salary',
    title: 'Salary updated',
    description: 'Your salary information was updated.',
    timestamp: 'Aug 20',
  },
];

const INITIAL_STATS = {
  presentDays: 22,
  leaveBalance: 8,
  workingHours: '176h',
  netSalary: 45000,
};

export default function Dashboard({ user }) {
  const { currentUser } = useAuth();
  // Safe Fallback for Authenticated User Name
  const employeeName = user?.name || user?.fullName || currentUser?.name || 'John';

  // Dashboard state
  const [stats, setStats] = useState(INITIAL_STATS);
  const [activities, setActivities] = useState(MOCK_RECENT_ACTIVITIES);
  const [attendanceData, setAttendanceData] = useState(MOCK_ATTENDANCE_CHART_DATA);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line'); // 'line' | 'bar'

  // Time-Aware Greeting Logic
  const getTimeAwareGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Indian Rupee Currency Formatting helper
  const formatSalary = (amount) => {
    if (typeof amount === 'number') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return amount || '₹0';
  };

  // Fetch Dashboard Data from Services with Retry capability
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [attendanceRes, leaveRes, payrollRes] = await Promise.allSettled([
        getMyAttendance(),
        getMyLeaves(),
        getMyPayroll(),
      ]);

      // Merge real responses if available
      setStats((prev) => {
        let updated = { ...prev };
        if (attendanceRes.status === 'fulfilled' && attendanceRes.value) {
          updated.presentDays = attendanceRes.value.presentCount ?? prev.presentDays;
          updated.workingHours = attendanceRes.value.totalHours ?? prev.workingHours;
        }
        if (leaveRes.status === 'fulfilled' && leaveRes.value) {
          updated.leaveBalance = leaveRes.value.balance ?? prev.leaveBalance;
        }
        if (payrollRes.status === 'fulfilled' && payrollRes.value) {
          updated.netSalary = payrollRes.value.netSalary ?? prev.netSalary;
        }
        return updated;
      });
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* ERROR STATE WITH RETRY BUTTON */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 1. WELCOME SECTION */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Dayflow Employee Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              {getTimeAwareGreeting()}, {employeeName} <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Here's your workday overview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Saturday, 22 Aug 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RESPONSIVE STATISTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Present Days"
          value={stats.presentDays}
          subtitle="91.6% attendance rate"
          icon={CalendarCheck}
          badge="This Month"
          color="emerald"
          loading={loading}
        />
        <StatCard
          title="Leave Balance"
          value={stats.leaveBalance}
          subtitle="Days available in annual quota"
          icon={CalendarDays}
          badge="Quota Left"
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Working Hours"
          value={stats.workingHours}
          subtitle="Avg 8.0h / day target"
          icon={Clock3}
          badge="Logged"
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Net Salary"
          value={formatSalary(stats.netSalary)}
          subtitle="Monthly take-home pay"
          icon={IndianRupee}
          badge="Monthly"
          color="amber"
          loading={loading}
        />
      </div>

      {/* 3. CONTENT GRID: RECENT ACTIVITY & ATTENDANCE MINI-CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ACTIVITY SECTION */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BellRing className="w-5 h-5 text-indigo-600" />
                Recent Activity
              </h2>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {activities.length} Updates
              </span>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-3.5 rounded-xl border border-slate-100 space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-3 w-full bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No recent activity</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your recent HR activities will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ATTENDANCE MINI-CHART SECTION */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Attendance Overview
              </h2>
              <p className="text-xs text-slate-500">Work hours this week</p>
            </div>

            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  chartType === 'line' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Line Chart
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  chartType === 'bar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-64 w-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center text-xs text-slate-400">
              Loading Chart Data...
            </div>
          ) : (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={attendanceData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} domain={[0, 10]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '12px',
                        color: '#FFF',
                        border: 'none',
                        fontSize: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                      }}
                      formatter={(value) => [`${value} hours`, 'Work Hours']}
                    />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#FFF' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={attendanceData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} domain={[0, 10]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '12px',
                        color: '#FFF',
                        border: 'none',
                        fontSize: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                      }}
                      formatter={(value) => [`${value} hours`, 'Work Hours']}
                    />
                    <Bar dataKey="hours" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
