import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  CalendarCheck,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserCheck,
  ArrowUpRight,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';

const attendanceChartData = [
  { day: 'Mon', hours: 8.5 },
  { day: 'Tue', hours: 9.0 },
  { day: 'Wed', hours: 8.8 },
  { day: 'Thu', hours: 9.2 },
  { day: 'Fri', hours: 8.0 },
];

export default function EmployeeDashboard() {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  const handleToggleCheckIn = () => {
    if (!isCheckedIn) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsCheckedIn(true);
      setCheckInTime(now);
      addToast(`Checked in successfully at ${now}`, 'success');
    } else {
      setIsCheckedIn(false);
      addToast('Checked out for the day. Have a great evening!', 'info');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5" /> Employee Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {currentUser?.name || 'Alex'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            You have <strong className="text-slate-200">12 available leave days</strong> and your next payroll payout date is <strong className="text-slate-200">August 31st</strong>.
          </p>
        </div>

        {/* Quick Attendance Clock-In Widget */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 shrink-0 shadow-lg relative z-10">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Shift Clock</p>
            <p className="text-xs font-bold text-slate-200">
              {isCheckedIn ? `In since ${checkInTime}` : 'Not Checked In'}
            </p>
          </div>
          <Button
            onClick={handleToggleCheckIn}
            variant={isCheckedIn ? 'danger' : 'success'}
            size="sm"
            icon={Clock}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Attendance Rate"
          value="98.5%"
          trend={2.4}
          trendLabel="vs last month"
          icon={CalendarCheck}
          color="indigo"
        />
        <StatCard
          title="Leave Balance"
          value="12 Days"
          subtitle="Annual PTO Remaining"
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Monthly Net Pay"
          value={formatCurrency(9000)}
          subtitle="Processed for Aug 2026"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Active Projects"
          value="4 Tasks"
          subtitle="Engineering & Sprint 14"
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Analytics & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Working Hours Chart */}
        <Card glass className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly Working Hours</CardTitle>
              <CardDescription>Tracked hours across current week</CardDescription>
            </div>
            <Badge variant="indigo" size="sm">
              Avg 8.7 hrs/day
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceChartData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 12]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Shortcuts Card */}
        <Card glass>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Direct navigation shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <NavLink
              to="/employee/profile"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/30 text-slate-200 text-xs font-semibold transition-all group"
            >
              <span>View & Edit My Profile</span>
              <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NavLink>

            <NavLink
              to="/employee/leave"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/30 text-slate-200 text-xs font-semibold transition-all group"
            >
              <span>Request Leave / PTO</span>
              <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NavLink>

            <NavLink
              to="/employee/payroll"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-slate-200 text-xs font-semibold transition-all group"
            >
              <span>Download Latest Payslip</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NavLink>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
