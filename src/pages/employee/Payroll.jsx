/** Module 7 — Employee Payroll with BorderGlow & SpecularButton */
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
import BorderGlow from '../../components/ui/BorderGlow';
import SpecularButton from '../../components/ui/SpecularButton';

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-indigo-950 text-indigo-100 border border-indigo-500/40 text-sm font-semibold flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs underline opacity-80 hover:opacity-100 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-indigo-400" />
            My Payroll & Salary Slip
          </h1>
          <p className="text-sm text-slate-400">
            View salary breakdown, allowances, deductions, and download monthly payslips.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-950/80 text-emerald-400 px-3.5 py-2 rounded-xl border border-emerald-500/30 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Status: Verified & Processed</span>
        </div>
      </div>

      {/* Salary Overview Card wrapped in BorderGlow */}
      <BorderGlow
        borderRadius={28}
        backgroundColor="rgba(15, 23, 42, 0.95)"
        glowColor="160 85 80"
        colors={['#34d399', '#10b981', '#38bdf8']}
        glowRadius={50}
        edgeSensitivity={25}
        className="w-full shadow-2xl overflow-hidden"
      >
        <div className="p-6 sm:p-8 text-white space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Current Month Net Pay</span>
              <p className="text-3xl sm:text-4xl font-extrabold text-white pt-1">{formatCurrency(payrollData.netSalary)}</p>
              <p className="text-xs text-slate-400 pt-1">Payout scheduled for August 31, 2026</p>
            </div>
            <SpecularButton
              size="md"
              radius={14}
              baseColor="#059669"
              lineColor="#34d399"
              textColor="#ffffff"
              onClick={handleDownloadPayslip}
            >
              <Download className="w-4 h-4 mr-1.5" /> Download August Payslip
            </SpecularButton>
          </div>

          {/* Salary Breakdown 4 Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Basic Pay</span>
              <p className="text-lg font-bold text-white">{formatCurrency(payrollData.basicSalary)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">HRA Allowance</span>
              <p className="text-lg font-bold text-white">{formatCurrency(payrollData.hra)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Other Allowances</span>
              <p className="text-lg font-bold text-white">{formatCurrency(payrollData.allowances)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-1">
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Deductions (PF / Tax)</span>
              <p className="text-lg font-bold text-rose-400">-{formatCurrency(payrollData.deductions)}</p>
            </div>
          </div>
        </div>
      </BorderGlow>

      {/* Issued Payslips History Table wrapped in BorderGlow */}
      <BorderGlow
        borderRadius={24}
        backgroundColor="rgba(15, 23, 42, 0.9)"
        glowColor="250 85 80"
        colors={['#818cf8', '#c084fc', '#38bdf8']}
        glowRadius={40}
        edgeSensitivity={20}
        className="w-full shadow-2xl"
      >
        <div className="p-6 space-y-4">
          <div className="pb-3 border-b border-slate-800/80">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-400" />
              Payslip History & Downloads
            </h2>
            <p className="text-xs text-slate-400">Download previously issued monthly payslips</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Payslip ID</th>
                  <th className="py-3.5 px-4">Pay Period</th>
                  <th className="py-3.5 px-4">Net Salary</th>
                  <th className="py-3.5 px-4">Payout Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {payslips.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{row.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{row.month}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrency(row.netSalary)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.payDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                        Paid
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={handleDownloadPayslip}
                        className="p-1.5 px-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-400" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </BorderGlow>
    </div>
  );
}
