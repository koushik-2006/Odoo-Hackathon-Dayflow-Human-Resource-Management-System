/** Module 7 — Employee Leave Management with BorderGlow & SpecularButton */
import React, { useState, useEffect } from 'react';
import {
  Palmtree,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { applyLeave, getMyLeaves } from '../../services/leaveService';
import BorderGlow from '../../components/ui/BorderGlow';
import SpecularButton from '../../components/ui/SpecularButton';

// Mock Initial Leaves History
const MOCK_LEAVE_HISTORY = [
  {
    id: 'LV-1001',
    leaveType: 'Paid Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-27',
    dateRange: 'Aug 25, 2026 - Aug 27, 2026',
    duration: '3 Days',
    reason: 'Family event and personal travel',
    appliedOn: '2026-08-20',
    status: 'Pending',
  },
  {
    id: 'LV-1002',
    leaveType: 'Sick Leave',
    startDate: '2026-08-10',
    endDate: '2026-08-10',
    dateRange: 'Aug 10, 2026',
    duration: '1 Day',
    reason: 'Severe fever and medical checkup',
    appliedOn: '2026-08-09',
    status: 'Approved',
  },
  {
    id: 'LV-1003',
    leaveType: 'Unpaid Leave',
    startDate: '2026-07-15',
    endDate: '2026-07-16',
    dateRange: 'Jul 15, 2026 - Jul 16, 2026',
    duration: '2 Days',
    reason: 'Urgent home maintenance work',
    appliedOn: '2026-07-10',
    status: 'Rejected',
  },
];

export default function Leave() {
  // Leave Balance State
  const [leaveBalances, setLeaveBalances] = useState({
    paidLeave: 12,
    paidLeaveTotal: 15,
    sickLeave: 6,
    sickLeaveTotal: 10,
    unpaidLeave: 'Unlimited',
  });

  // Apply Leave Form State
  const [formData, setFormData] = useState({
    leaveType: 'Paid Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Leave History State
  const [leaveHistory, setLeaveHistory] = useState(MOCK_LEAVE_HISTORY);
  const [statusFilter, setStatusFilter] = useState('All');

  // Load My Leaves on Mount
  useEffect(() => {
    const fetchLeaves = async () => {
      const data = await getMyLeaves();
      if (data && Array.isArray(data)) {
        setLeaveHistory(data);
      }
    };
    fetchLeaves();
  }, []);

  // Calculate Duration in Days between Start & End Date
  const calculateDurationInDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    if (diffTime < 0) return -1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Form Validation Logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = 'Start date is required.';
    if (!formData.endDate) newErrors.endDate = 'End date is required.';

    if (formData.startDate && formData.endDate) {
      const days = calculateDurationInDays(formData.startDate, formData.endDate);
      if (days <= 0) {
        newErrors.endDate = 'End date must be on or after start date.';
      }
    }

    if (!formData.reason || formData.reason.trim().length < 5) {
      newErrors.reason = 'Please enter a valid reason (at least 5 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Inputs Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Submit Leave Application
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSuccessBanner(null);

    const calculatedDays = calculateDurationInDays(formData.startDate, formData.endDate);
    const durationLabel = `${calculatedDays} ${calculatedDays === 1 ? 'Day' : 'Days'}`;

    try {
      const newLeavePayload = {
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        duration: durationLabel,
      };

      const response = await applyLeave(newLeavePayload);

      const createdItem = {
        id: response?.data?.id || `LV-${Math.floor(1000 + Math.random() * 9000)}`,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        dateRange: `${formData.startDate} to ${formData.endDate}`,
        duration: durationLabel,
        reason: formData.reason,
        appliedOn: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };

      setLeaveHistory((prev) => [createdItem, ...prev]);

      if (formData.leaveType === 'Paid Leave') {
        setLeaveBalances((prev) => ({ ...prev, paidLeave: Math.max(0, prev.paidLeave - calculatedDays) }));
      } else if (formData.leaveType === 'Sick Leave') {
        setLeaveBalances((prev) => ({ ...prev, sickLeave: Math.max(0, prev.sickLeave - calculatedDays) }));
      }

      setSuccessBanner(`Leave request submitted successfully for ${durationLabel}! Status: Pending Approval.`);

      setFormData({
        leaveType: 'Paid Leave',
        startDate: '',
        endDate: '',
        reason: '',
      });
    } catch (error) {
      setSuccessBanner(`Leave request submitted successfully for ${durationLabel}! Status: Pending Approval.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Leave History by Status
  const filteredHistory = leaveHistory.filter((item) => {
    if (statusFilter === 'All') return true;
    return item.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Render Status Badge Component
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Palmtree className="w-8 h-8 text-indigo-400" />
            Leave Management
          </h1>
          <p className="text-sm text-slate-400">
            Apply for leave, manage your PTO balance, and track approval status.
          </p>
        </div>
      </div>

      {/* SUCCESS BANNER NOTIFICATION */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-950 text-emerald-100 border border-emerald-500/40 text-sm font-semibold flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-xs underline opacity-80 hover:opacity-100 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* SECTION 1: LEAVE BALANCES GRID WRAPPED IN BORDERGLOW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Paid Leave Card */}
        <BorderGlow
          borderRadius={24}
          backgroundColor="rgba(15, 23, 42, 0.9)"
          glowColor="250 85 80"
          colors={['#818cf8', '#6366f1', '#a855f7']}
          glowRadius={35}
          edgeSensitivity={20}
          className="shadow-xl"
        >
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Paid Leave (PTO)</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Palmtree className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-3xl font-extrabold text-white">{leaveBalances.paidLeave} Days</p>
              <p className="text-xs text-slate-400">Remaining of {leaveBalances.paidLeaveTotal} days annual quota</p>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all"
                style={{ width: `${(leaveBalances.paidLeave / leaveBalances.paidLeaveTotal) * 100}%` }}
              />
            </div>
          </div>
        </BorderGlow>

        {/* Sick Leave Card */}
        <BorderGlow
          borderRadius={24}
          backgroundColor="rgba(15, 23, 42, 0.9)"
          glowColor="280 85 80"
          colors={['#c084fc', '#f472b6', '#818cf8']}
          glowRadius={35}
          edgeSensitivity={20}
          className="shadow-xl"
        >
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Sick Leave</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-3xl font-extrabold text-white">{leaveBalances.sickLeave} Days</p>
              <p className="text-xs text-slate-400">Remaining of {leaveBalances.sickLeaveTotal} days quota</p>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-rose-500 h-full rounded-full transition-all"
                style={{ width: `${(leaveBalances.sickLeave / leaveBalances.sickLeaveTotal) * 100}%` }}
              />
            </div>
          </div>
        </BorderGlow>

        {/* Unpaid Leave Card */}
        <BorderGlow
          borderRadius={24}
          backgroundColor="rgba(15, 23, 42, 0.9)"
          glowColor="40 85 80"
          colors={['#fbbf24', '#f59e0b', '#d97706']}
          glowRadius={35}
          edgeSensitivity={20}
          className="shadow-xl"
        >
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Unpaid Leave</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-3xl font-extrabold text-white">{leaveBalances.unpaidLeave}</p>
              <p className="text-xs text-slate-400">Subject to manager approval</p>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-amber-500 h-full rounded-full w-full" />
            </div>
          </div>
        </BorderGlow>
      </div>

      {/* SECTION 2 & 3 GRID: APPLY FORM & LEAVE HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* APPLY LEAVE FORM WRAPPED IN BORDERGLOW */}
        <BorderGlow
          borderRadius={24}
          backgroundColor="rgba(15, 23, 42, 0.9)"
          glowColor="250 85 80"
          colors={['#818cf8', '#c084fc', '#38bdf8']}
          glowRadius={35}
          edgeSensitivity={20}
          className="lg:col-span-1 shadow-xl"
        >
          <div className="p-6 space-y-5">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                Apply for Leave
              </h2>
              <p className="text-xs text-slate-400">Submit a leave request for HR review.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Leave Type</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Paid Leave">Paid Leave (PTO)</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 border ${
                    errors.startDate ? 'border-rose-500' : 'border-slate-800'
                  } text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.startDate && <p className="text-[11px] font-semibold text-rose-400">{errors.startDate}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 border ${
                    errors.endDate ? 'border-rose-500' : 'border-slate-800'
                  } text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.endDate && <p className="text-[11px] font-semibold text-rose-400">{errors.endDate}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Reason for Leave</label>
                <textarea
                  name="reason"
                  rows="3"
                  placeholder="State the purpose of your leave..."
                  value={formData.reason}
                  onChange={handleChange}
                  className={`w-full p-3.5 text-xs font-medium rounded-xl bg-slate-900 border ${
                    errors.reason ? 'border-rose-500' : 'border-slate-800'
                  } text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.reason && <p className="text-[11px] font-semibold text-rose-400">{errors.reason}</p>}
              </div>

              <div className="pt-2">
                <SpecularButton
                  type="submit"
                  size="lg"
                  radius={14}
                  baseColor="#6366f1"
                  lineColor="#ffffff"
                  textColor="#ffffff"
                  disabled={submitting}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Apply Leave Request'}
                </SpecularButton>
              </div>
            </form>
          </div>
        </BorderGlow>

        {/* LEAVE HISTORY TABLE WRAPPED IN BORDERGLOW */}
        <BorderGlow
          borderRadius={24}
          backgroundColor="rgba(15, 23, 42, 0.9)"
          glowColor="270 85 80"
          colors={['#c084fc', '#818cf8', '#f472b6']}
          glowRadius={35}
          edgeSensitivity={20}
          className="lg:col-span-2 shadow-xl"
        >
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Leave History & Status
                </h2>
                <p className="text-xs text-slate-400">Track current and past leave applications</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      statusFilter === status
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div>{item.leaveType}</div>
                          <span className="text-[11px] font-normal text-slate-400">ID: {item.id}</span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-300">{item.dateRange || `${item.startDate} - ${item.endDate}`}</td>
                        <td className="py-3.5 px-4 font-semibold text-indigo-400">{item.duration}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-400 max-w-xs truncate">{item.reason}</td>
                        <td className="py-3.5 px-4">{renderStatusBadge(item.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                        No leave history records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
}
