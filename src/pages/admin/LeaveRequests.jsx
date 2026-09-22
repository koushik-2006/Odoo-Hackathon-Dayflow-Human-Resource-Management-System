import React, { useState } from 'react';
import { ClipboardList, Check, X, ShieldAlert } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export default function LeaveRequests() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState([
    { id: 'LV-103', empName: 'Alex Mercer', type: 'Casual Leave', dates: 'Aug 28 - Aug 29', days: 2, status: 'Pending', reason: 'Personal errand' },
    { id: 'LV-104', empName: 'Michael Scott', type: 'Annual Leave', dates: 'Sep 10 - Sep 15', days: 5, status: 'Pending', reason: 'Vacation' },
    { id: 'LV-101', empName: 'Sarah Connor', type: 'Annual Leave', dates: 'Sep 01 - Sep 05', days: 5, status: 'Approved', reason: 'Family trip' },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    addToast(`Leave request ${id} marked as ${newStatus}`, newStatus === 'Approved' ? 'success' : 'warning');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Leave Applications Approval</h1>
        <p className="text-xs text-slate-400">Review employee PTO requests and render decisions</p>
      </div>

      <Card glass>
        <CardHeader>
          <CardTitle>Pending & Past Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs text-indigo-400 font-bold">{row.id}</TableCell>
                  <TableCell className="font-bold text-slate-200">{row.empName}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.dates}</TableCell>
                  <TableCell>{row.days} days</TableCell>
                  <TableCell className="text-xs text-slate-400 max-w-xs truncate">{row.reason}</TableCell>
                  <TableCell>
                    <Badge
                      variant={row.status === 'Approved' ? 'success' : row.status === 'Pending' ? 'warning' : 'error'}
                      size="sm"
                      dot
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {row.status === 'Pending' ? (
                      <div className="flex items-center gap-1.5">
                        <Button
                          onClick={() => handleStatusChange(row.id, 'Approved')}
                          variant="success"
                          size="sm"
                          icon={Check}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleStatusChange(row.id, 'Rejected')}
                          variant="danger"
                          size="sm"
                          icon={X}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Decided</span>
                    )}
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
