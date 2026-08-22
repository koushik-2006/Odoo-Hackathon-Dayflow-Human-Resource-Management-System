import React, { useState } from 'react';
import { CalendarCheck, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export default function Attendance() {
  const { addToast } = useToast();
  const [logs, setLogs] = useState([
    { date: '2026-08-22', checkIn: '09:02 AM', checkOut: '06:05 PM', status: 'Present', hours: '9.0 hrs' },
    { date: '2026-08-21', checkIn: '08:55 AM', checkOut: '06:00 PM', status: 'Present', hours: '9.0 hrs' },
    { date: '2026-08-20', checkIn: '09:15 AM', checkOut: '06:10 PM', status: 'Late', hours: '8.9 hrs' },
    { date: '2026-08-19', checkIn: '08:50 AM', checkOut: '05:55 PM', status: 'Present', hours: '9.0 hrs' },
    { date: '2026-08-18', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: '9.0 hrs' },
  ]);

  const handleManualCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs((prev) => [
      { date: today, checkIn: time, checkOut: 'In Progress', status: 'Present', hours: '--' },
      ...prev,
    ]);
    addToast('Recorded check-in for today!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Attendance Log</h1>
          <p className="text-xs text-slate-400">View daily punch times and monthly work hours</p>
        </div>
        <Button onClick={handleManualCheckIn} variant="primary" icon={Clock} size="sm">
          Punch Clock Now
        </Button>
      </div>

      <Card glass>
        <CardHeader>
          <CardTitle>Recent Clocking History</CardTitle>
          <CardDescription>Records for current month</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold text-slate-200">{row.date}</TableCell>
                  <TableCell>{row.checkIn}</TableCell>
                  <TableCell>{row.checkOut}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Present' ? 'success' : 'warning'} size="sm" dot>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{row.hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
