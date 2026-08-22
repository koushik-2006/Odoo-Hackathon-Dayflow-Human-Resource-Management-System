import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  ClipboardList,
  DollarSign,
  TrendingUp,
  UserPlus,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import StatCard from '../../components/common/StatCard';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';

const companyHeadcountData = [
  { dept: 'Eng', count: 42 },
  { dept: 'HR', count: 12 },
  { dept: 'Sales', count: 28 },
  { dept: 'Design', count: 18 },
  { dept: 'Ops', count: 15 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Admin Hero Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Admin Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Company HR Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Managing <strong className="text-slate-200">115 active employees</strong> across 5 departments. You have <strong className="text-amber-400">5 pending leave applications</strong> awaiting review.
          </p>
        </div>

        <NavLink to="/admin/employees">
          <Button variant="primary" icon={UserPlus} size="md">
            Manage Directory
          </Button>
        </NavLink>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workforce"
          value="115 Staff"
          trend={4.8}
          trendLabel="vs last month"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Today Present"
          value="108 Staff"
          subtitle="94% attendance today"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Pending Requests"
          value="5 Leave"
          subtitle="Requires Approval"
          icon={ClipboardList}
          color="amber"
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(485000)}
          subtitle="Total company payout"
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Analytics Charts & Management Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution Chart */}
        <Card glass className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Department Headcount</CardTitle>
              <CardDescription>Active staff distribution across teams</CardDescription>
            </div>
            <Badge variant="purple" size="sm">
              5 Teams
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyHeadcountData}>
                  <XAxis dataKey="dept" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Admin Actions */}
        <Card glass>
          <CardHeader>
            <CardTitle>Admin Operations</CardTitle>
            <CardDescription>Management shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <NavLink
              to="/admin/employees"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/30 text-slate-200 text-xs font-semibold transition-all group"
            >
              <span>Employee Directory & Profiles</span>
              <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NavLink>

            <NavLink
              to="/admin/leave-requests"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 text-slate-200 text-xs font-semibold transition-all group"
            >
              <span>Review 5 Leave Applications</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NavLink>

            <NavLink
              to="/admin/payroll"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-slate-200 text-xs font-semibold transition-all group"
            >
              <span>Process Monthly Payroll Batch</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NavLink>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
