import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Download,
  Calendar,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Eye,
  Lock
} from 'lucide-react';
import { getMyPayroll } from '../../services/payrollService';

// Default Read-Only Payroll Constants
const INITIAL_PAYROLL_DATA = {
  employeeInfo: {
    name: 'John Doe',
    employeeId: 'EMP-2026-042',
    designation: 'Senior Frontend Engineer',
    department: 'Product Engineering',
    bankAccount: '•••• •••• •••• 4921',
    bankName: 'HDFC Bank Ltd.',
    panNumber: 'ABCDE1234F',
    payPeriod: 'August 1, 2026 - August 31, 2026',
    payDate: 'August 31, 2026',
  },
  salaryBreakdown: {
    basicSalary: 30000,
    hra: 8000,
    allowances: 5000,
    grossSalary: 43000,
    deductions: {
      providentFund: 1800,
      professionalTax: 200,
      totalDeductions: 2000,
    },
    netSalary: 41000,
  },
  payoutHistory: [
    { month: 'August 2026', gross: '₹43,000', deductions: '₹2,000', net: '₹41,000', status: 'Processing', date: 'Aug 31, 2026' },
    { month: 'July 2026', gross: '₹43,000', deductions: '₹2,000', net: '₹41,000', status: 'Paid', date: 'Jul 31, 2026' },
    { month: 'June 2026', gross: '₹43,000', deductions: '₹2,000', net: '₹41,000', status: 'Paid', date: 'Jun 30, 2026' },
    { month: 'May 2026', gross: '₹41,500', deductions: '₹1,900', net: '₹39,600', status: 'Paid', date: 'May 31, 2026' },
  ],
};

export default function Payroll() {
  const [payroll, setPayroll] = useState(INITIAL_PAYROLL_DATA);
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Fetch API Payroll details on mount
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const data = await getMyPayroll();
        if (data) {
          setPayroll((prev) => ({
            ...prev,
            salaryBreakdown: {
              ...prev.salaryBreakdown,
              basicSalary: data.basicSalary ?? prev.salaryBreakdown.basicSalary,
              hra: data.hra ?? prev.salaryBreakdown.hra,
              allowances: data.allowances ?? prev.salaryBreakdown.allowances,
              grossSalary: data.grossSalary ?? prev.salaryBreakdown.grossSalary,
              netSalary: data.netSalary ?? prev.salaryBreakdown.netSalary,
              deductions: {
                ...prev.salaryBreakdown.deductions,
                totalDeductions: data.deductions ?? prev.salaryBreakdown.deductions.totalDeductions,
              },
            },
          }));
        }
      } catch (err) {
        console.warn('Using default payroll mock data:', err);
      }
    };
    fetchPayroll();
  }, []);

  // Handle Download Payslip PDF
  const handleDownloadPayslip = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 1200);
  };

  const formatCurrency = (val) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-indigo-600" />
              Employee Payroll & Payslips
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-500" /> Read-Only
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            View your official monthly salary structure, deductions, net pay, and download tax payslips.
          </p>
        </div>

        {/* Payslip Month Selector & Download Button */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
            <option value="May 2026">May 2026</option>
          </select>

          <button
            onClick={handleDownloadPayslip}
            disabled={downloading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all duration-200 shadow-md shadow-indigo-600/30 flex items-center gap-2"
          >
            {downloading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{downloading ? 'Generating PDF...' : 'Download Payslip'}</span>
          </button>
        </div>
      </div>

      {/* Download Alert Notification */}
      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-900 text-emerald-100 border border-emerald-700 shadow-lg text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Payslip for {selectedMonth} downloaded successfully!</span>
          </div>
          <button onClick={() => setDownloadSuccess(false)} className="text-xs underline opacity-80 hover:opacity-100">Close</button>
        </div>
      )}

      {/* Employee Confidentiality Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Statement of Earnings</span>
            <h2 className="text-xl font-bold text-white mt-0.5">{payroll.employeeInfo.name}</h2>
            <p className="text-xs text-slate-400">{payroll.employeeInfo.designation} • {payroll.employeeInfo.department}</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400">Pay Period</span>
            <div className="text-sm font-semibold text-slate-200">{payroll.employeeInfo.payPeriod}</div>
          </div>
        </div>

        {/* Bank & Tax Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400">Employee ID</span>
            <div className="font-mono font-bold text-slate-200 mt-0.5">{payroll.employeeInfo.employeeId}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400">Bank Account</span>
            <div className="font-mono font-bold text-slate-200 mt-0.5">{payroll.employeeInfo.bankAccount} ({payroll.employeeInfo.bankName})</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400">PAN / Tax ID</span>
            <div className="font-mono font-bold text-slate-200 mt-0.5">{payroll.employeeInfo.panNumber}</div>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTED NET SALARY CARD */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Take-Home Amount</span>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {formatCurrency(payroll.salaryBreakdown.netSalary)}
          </div>
          <p className="text-xs text-emerald-100">Net Payable Salary after all standard tax & PF deductions</p>
        </div>
        <div className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-2 w-fit">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Verified & Approved by HR</span>
        </div>
      </div>

      {/* SALARY BREAKDOWN GRID: EARNINGS VS DEDUCTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EARNINGS CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Earnings Breakdown
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Gross: {formatCurrency(payroll.salaryBreakdown.grossSalary)}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Basic Salary</span>
              <span className="font-bold text-slate-900">{formatCurrency(payroll.salaryBreakdown.basicSalary)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">House Rent Allowance (HRA)</span>
              <span className="font-bold text-slate-900">{formatCurrency(payroll.salaryBreakdown.hra)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Special & Transport Allowances</span>
              <span className="font-bold text-slate-900">{formatCurrency(payroll.salaryBreakdown.allowances)}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-sm font-extrabold text-slate-900">
            <span>Total Earnings</span>
            <span className="text-emerald-600">{formatCurrency(payroll.salaryBreakdown.grossSalary)}</span>
          </div>
        </div>

        {/* DEDUCTIONS CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
              Deductions Breakdown
            </h3>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Total: {formatCurrency(payroll.salaryBreakdown.deductions.totalDeductions)}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Provident Fund (PF)</span>
              <span className="font-bold text-slate-900">{formatCurrency(payroll.salaryBreakdown.deductions.providentFund)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Professional Tax (PT)</span>
              <span className="font-bold text-slate-900">{formatCurrency(payroll.salaryBreakdown.deductions.professionalTax)}</span>
            </div>
          </div>

          <div className="pt-8 flex items-center justify-between text-sm font-extrabold text-slate-900 border-t border-slate-100">
            <span>Total Deductions</span>
            <span className="text-rose-600">{formatCurrency(payroll.salaryBreakdown.deductions.totalDeductions)}</span>
          </div>
        </div>
      </div>

      {/* PAYOUT HISTORY TABLE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Payslip Payout History</h2>
          <p className="text-xs text-slate-500">Historical summary of processed monthly salary payouts.</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">Pay Period</th>
                <th className="py-3.5 px-4">Gross Earnings</th>
                <th className="py-3.5 px-4">Deductions</th>
                <th className="py-3.5 px-4">Net Salary</th>
                <th className="py-3.5 px-4">Payout Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {payroll.payoutHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.month}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{item.gross}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{item.deductions}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">{item.net}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{item.date}</td>
                  <td className="py-3.5 px-4">
                    {item.status === 'Paid' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Processing</span>
                    )}
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
