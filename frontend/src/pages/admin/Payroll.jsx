import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Play, Download } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function AdminPayroll() {
  const { addToast } = useToast();
  const [payrollBatch, setPayrollBatch] = useState([
    { id: 'PAY-EMP-2045', name: 'Alex Mercer', dept: 'Engineering', basic: 6500, hra: 1800, allowances: 700, net: 9000, status: 'Ready' },
    { id: 'PAY-EMP-1001', name: 'Sarah Connor', dept: 'Human Resources', basic: 8500, hra: 2200, allowances: 1000, net: 11700, status: 'Ready' },
    { id: 'PAY-EMP-4050', name: 'Michael Scott', dept: 'Sales', basic: 7000, hra: 2000, allowances: 800, net: 9800, status: 'Ready' },
  ]);

  const handleProcessAll = () => {
    setPayrollBatch((prev) => prev.map((item) => ({ ...item, status: 'Processed' })));
    addToast('Payroll batch processed! Funds disbursed to employee bank accounts.', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Payroll Operations</h1>
          <p className="text-xs text-slate-400">Process monthly salary disbursements for company staff</p>
        </div>
        <Button onClick={handleProcessAll} variant="primary" icon={Play} size="sm">
          Run Payroll Batch
        </Button>
      </div>

      <Card glass>
        <CardHeader>
          <CardTitle>August 2026 Salary Payroll Queue</CardTitle>
          <CardDescription>Review and execute payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>HRA</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollBatch.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-bold text-slate-200">{row.name}</TableCell>
                  <TableCell>{row.dept}</TableCell>
                  <TableCell>{formatCurrency(row.basic)}</TableCell>
                  <TableCell>{formatCurrency(row.hra)}</TableCell>
                  <TableCell>{formatCurrency(row.allowances)}</TableCell>
                  <TableCell className="font-bold text-emerald-400">{formatCurrency(row.net)}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Processed' ? 'success' : 'warning'} size="sm" dot>
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
