import React from 'react';
import { CalendarCheck, Users, Clock } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

export default function AdminAttendance() {
  const companyLogs = [
    { name: 'Alex Mercer', id: 'EMP-2045', dept: 'Engineering', checkIn: '09:02 AM', checkOut: '06:05 PM', status: 'Present' },
    { name: 'Sarah Connor', id: 'EMP-1001', dept: 'Human Resources', checkIn: '08:45 AM', checkOut: '05:50 PM', status: 'Present' },
    { name: 'Michael Scott', id: 'EMP-4050', dept: 'Sales', checkIn: '09:30 AM', checkOut: '05:30 PM', status: 'Late' },
    { name: 'Dwight Schrute', id: 'EMP-4051', dept: 'Sales', checkIn: '08:00 AM', checkOut: '07:00 PM', status: 'Present' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Company Attendance Overview</h1>
        <p className="text-xs text-slate-400">Daily punch records across all staff</p>
      </div>

      <Card glass>
        <CardHeader>
          <CardTitle>Daily Attendance Roster</CardTitle>
          <CardDescription>Live log for today</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Employee</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companyLogs.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-bold text-slate-200">{row.name}</TableCell>
                  <TableCell className="font-mono text-xs text-indigo-400 font-bold">{row.id}</TableCell>
                  <TableCell>{row.dept}</TableCell>
                  <TableCell>{row.checkIn}</TableCell>
                  <TableCell>{row.checkOut}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Present' ? 'success' : 'warning'} size="sm" dot>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
