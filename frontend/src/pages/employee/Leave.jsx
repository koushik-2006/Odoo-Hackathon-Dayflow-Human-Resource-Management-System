import React, { useState } from 'react';
import { FileText, Plus, CheckCircle2, Clock } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

export default function Leave() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([
    { id: 'LV-101', type: 'Annual Leave', startDate: '2026-09-01', endDate: '2026-09-05', days: 5, status: 'Approved', reason: 'Family vacation' },
    { id: 'LV-102', type: 'Sick Leave', startDate: '2026-08-10', endDate: '2026-08-10', days: 1, status: 'Approved', reason: 'Dental appointment' },
    { id: 'LV-103', type: 'Casual Leave', startDate: '2026-08-28', endDate: '2026-08-29', days: 2, status: 'Pending', reason: 'Personal errand' },
  ]);

  const [form, setForm] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason) {
      addToast('Please fill in all leave request fields', 'warning');
      return;
    }
    const newReq = {
      id: 'LV-' + Math.floor(100 + Math.random() * 900),
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days: 2,
      status: 'Pending',
      reason: form.reason,
    };
    setRequests([newReq, ...requests]);
    addToast('Leave request submitted to HR manager!', 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Leave Tracker</h1>
          <p className="text-xs text-slate-400">Request PTO and track application approval status</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" icon={Plus} size="sm">
          Apply For Leave
        </Button>
      </div>

      <Card glass>
        <CardHeader>
          <CardTitle>My Leave Requests</CardTitle>
          <CardDescription>Submitted applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Req ID</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs font-bold text-indigo-400">{row.id}</TableCell>
                  <TableCell className="font-medium text-slate-200">{row.type}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply For Leave"
        subtitle="Submit a new PTO request for manager approval"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Leave Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-sm rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </div>

          <Input
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />

          <Input
            label="End Date"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Reason</label>
            <textarea
              rows={3}
              placeholder="State reason for your leave request..."
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-sm rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Application</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
