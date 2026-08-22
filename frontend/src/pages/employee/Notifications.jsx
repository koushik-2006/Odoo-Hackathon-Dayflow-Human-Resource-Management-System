import React, { useState } from 'react';
import { Bell, Check, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export default function Notifications() {
  const { addToast } = useToast();
  const [items, setItems] = useState([
    { id: 1, title: 'Leave Request Approved', text: 'Your annual leave request for Sep 1-5 has been approved by HR.', time: '2 hours ago', unread: true },
    { id: 2, title: 'July Payslip Available', text: 'Your payslip for July 2026 is ready for download in your portal.', time: '1 day ago', unread: true },
    { id: 3, title: 'Company Townhall Meeting', text: 'All-hands Q3 alignment meeting scheduled for Friday at 3:00 PM EST.', time: '3 days ago', unread: false },
  ]);

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
    addToast('All notifications marked as read', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-400">Stay updated on approvals, payslips, and workplace updates</p>
        </div>
        <Button onClick={markAllRead} variant="outline" size="sm" icon={Check}>
          Mark All Read
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card
            key={item.id}
            glass
            className={`p-4 transition-all border ${
              item.unread ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-slate-800'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                  <span className="text-[11px] text-slate-500">{item.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.text}</p>
              </div>
              {item.unread && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 self-center" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
