import React from 'react';
import { Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function AdminNotifications() {
  const alerts = [
    { id: 1, title: '5 New Leave Requests', text: '5 staff members submitted leave applications needing approval.', time: '1 hour ago' },
    { id: 2, title: 'Monthly Payroll Run Pending', text: 'August 2026 payroll batch is prepared for disbursement execution.', time: '4 hours ago' },
    { id: 3, title: 'New Employee Registered', text: 'Employee ID EMP-4051 Dwight Schrute joined Sales department.', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Admin System Notifications</h1>
        <p className="text-xs text-slate-400">System alerts, leave submissions, and administrative updates</p>
      </div>

      <div className="space-y-3">
        {alerts.map((item) => (
          <Card key={item.id} glass className="p-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                  <span className="text-[11px] text-slate-500">{item.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{item.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
