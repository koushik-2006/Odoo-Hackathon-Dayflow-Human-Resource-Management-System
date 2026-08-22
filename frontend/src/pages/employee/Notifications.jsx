import React, { useState } from 'react';
import { Bell, Check, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import BorderGlow from '../../components/ui/BorderGlow';
import SpecularButton from '../../components/ui/SpecularButton';
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
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-indigo-400" />
            Notifications
          </h1>
          <p className="text-xs text-slate-400">Stay updated on approvals, payslips, and workplace updates</p>
        </div>
        <SpecularButton
          size="sm"
          radius={12}
          baseColor="#1e293b"
          lineColor="#64748b"
          textColor="#f8fafc"
          onClick={markAllRead}
        >
          <Check className="w-3.5 h-3.5 mr-1 text-indigo-400" />
          Mark All Read
        </SpecularButton>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <BorderGlow
            key={item.id}
            borderRadius={20}
            backgroundColor="rgba(15, 23, 42, 0.9)"
            glowColor={item.unread ? "250 85 80" : "210 30 50"}
            colors={item.unread ? ['#818cf8', '#c084fc', '#38bdf8'] : ['#475569', '#334155', '#1e293b']}
            glowRadius={30}
            edgeSensitivity={20}
            className="w-full shadow-xl"
          >
            <div className="p-4 sm:p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">{item.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.text}</p>
              </div>
              {item.unread && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 self-center animate-pulse" />
              )}
            </div>
          </BorderGlow>
        ))}
      </div>
    </div>
  );
}
