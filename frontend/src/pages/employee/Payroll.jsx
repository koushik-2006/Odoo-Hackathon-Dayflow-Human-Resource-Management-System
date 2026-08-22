/** Module 7 — Employee Payroll */
import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  IndianRupee,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { getMyPayroll } from '../../services/payrollService';

// Mock Payslip Data
const MOCK_PAYSLIPS = [
  { id: 'PAY-2026-07', month: 'July 2026', basicSalary: 35000, hra: 10000, allowances: 5000, deductions: 5000, netSalary: 45000, status: 'Paid', payDate: 'July 31, 2026' },
  { id: 'PAY-2026-06', month: 'June 2026', basicSalary: 35000, hra: 10000, allowances: 5000, deductions: 5000, netSalary: 45000, status: 'Paid', payDate: 'June 30, 2026' },
  { id: 'PAY-2026-05', month: 'May 2026', basicSalary: 35000, hra: 10000, allowances: 5000, deductions: 5000, netSalary: 45000, status: 'Paid', payDate: 'May 31, 2026' },
];

export default function Payroll() {
  const [payrollData, setPayrollData] = useState({
    basicSalary: 35000,
    hra: 10000,
    allowances: 5000,
    grossSalary: 50000,
    deductions: 5000,
    netSalary: 45000,
  });

  const [payslips, setPayslips] = useState(MOCK_PAYSLIPS);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchPayroll = async () => {
      const data = await getMyPayroll();
      if (data) {
        setPayrollData((prev) => ({ ...prev, ...data }));
      }
    };
    fetchPayroll();
  }, []);

  const formatCurrency = (amount) => {
    if (typeof amount === 'number') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return amount || '₹0';
  };

  const handleDownloadPayslip = () => {
    setToastMessage('Downloading official payslip PDF...');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-indigo-600 text-white text-sm font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white font-bold text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-indigo-600" />
            My Payroll & Salary Slip
          </h1>
          <p className="text-sm text-slate-500">
            View salary breakdown, allowances, deductions, and download monthly payslips.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl border border-emerald-200 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Status: Verified & Processed</span>
        </div>
      </div>

      {/* Salary Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/40 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/40 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Current Month Net Pay</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-white pt-1">{formatCurrency(payrollData.netSalary)}</p>
            <p className="text-xs text-slate-300 pt-1">Payout scheduled for August 31, 2026</p>
          </div>
          <button
            onClick={handleDownloadPayslip}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download August Payslip</span>
          </button>
        </div>

        {/* Salary Breakdown 4 Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Basic Pay</span>
            <p className="text-lg font-bold text-slate-100">{formatCurrency(payrollData.basicSalary)}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">HRA Allowance</span>
            <p className="text-lg font-bold text-slate-100">{formatCurrency(payrollData.hra)}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Other Allowances</span>
            <p className="text-lg font-bold text-slate-100">{formatCurrency(payrollData.allowances)}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[11px] font-semibold text-rose-300 uppercase">Deductions (PF / Tax)</span>
            <p className="text-lg font-bold text-rose-300">-{formatCurrency(payrollData.deductions)}</p>
          </div>
        </div>
      </div>

      {/* Issued Payslips History Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="pb-2 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            Payslip History & Downloads
          </h2>
          <p className="text-xs text-slate-500">Download previously issued monthly payslips</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Payslip ID</th>
                <th className="py-3 px-4">Pay Period</th>
                <th className="py-3 px-4">Net Salary</th>
                <th className="py-3 px-4">Payout Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payslips.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{row.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.month}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{formatCurrency(row.netSalary)}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.payDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Paid
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={handleDownloadPayslip}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
