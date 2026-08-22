import React from 'react';
import { DollarSign, Download, FileCheck, ShieldCheck } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function Payroll() {
  const { addToast } = useToast();
  const payslips = [
    { id: 'PAY-2026-07', month: 'July 2026', basicSalary: 6500, hra: 1800, allowances: 700, netSalary: 9000, status: 'Paid', date: '2026-07-31' },
    { id: 'PAY-2026-06', month: 'June 2026', basicSalary: 6500, hra: 1800, allowances: 700, netSalary: 9000, status: 'Paid', date: '2026-06-30' },
    { id: 'PAY-2026-05', month: 'May 2026', basicSalary: 6500, hra: 1800, allowances: 700, netSalary: 9000, status: 'Paid', date: '2026-05-31' },
  ];

  const handleDownloadPayslip = (month) => {
    addToast(`Downloading official payslip PDF for ${month}...`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Payroll & Payslips</h1>
        <p className="text-xs text-slate-400">View compensation history and download tax statements</p>
      </div>

      <Card glass>
        <CardHeader>
          <CardTitle>Issued Payslips</CardTitle>
          <CardDescription>Monthly salary disbursements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Payslip ID</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Basic</TableHead>
                <TableHead>HRA</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs font-bold text-indigo-400">{row.id}</TableCell>
                  <TableCell className="font-semibold text-slate-200">{row.month}</TableCell>
                  <TableCell>{formatCurrency(row.basicSalary)}</TableCell>
                  <TableCell>{formatCurrency(row.hra)}</TableCell>
                  <TableCell>{formatCurrency(row.allowances)}</TableCell>
                  <TableCell className="font-bold text-emerald-400">{formatCurrency(row.netSalary)}</TableCell>
                  <TableCell>
                    <Badge variant="success" size="sm" dot>{row.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDownloadPayslip(row.month)}
                      variant="outline"
                      size="sm"
                      icon={Download}
                    >
                      PDF
                    </Button>
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
