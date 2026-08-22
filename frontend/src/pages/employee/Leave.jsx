/** Module 7 — Employee Leave Management */
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

      // Prepend newly submitted leave request into state
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

      // Deduct balance if Paid or Sick
      if (formData.leaveType === 'Paid Leave') {
        setLeaveBalances((prev) => ({ ...prev, paidLeave: Math.max(0, prev.paidLeave - calculatedDays) }));
      } else if (formData.leaveType === 'Sick Leave') {
        setLeaveBalances((prev) => ({ ...prev, sickLeave: Math.max(0, prev.sickLeave - calculatedDays) }));
      }

      setSuccessBanner(`Leave request submitted successfully for ${durationLabel}! Status: Pending Approval.`);

      // Reset Form
      setFormData({
        leaveType: 'Paid Leave',
        startDate: '',
        endDate: '',
        reason: '',
      });
    } catch (error) {
      setErrors({ api: 'Failed to submit leave application. Please try again.' });
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Palmtree className="w-7 h-7 text-indigo-600" />
            Leave Management
          </h1>
          <p className="text-sm text-slate-500">
            Apply for leave, manage your PTO balance, and track approval status.
          </p>
        </div>
      </div>

      {/* SUCCESS BANNER NOTIFICATION */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-sm font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-white/80 hover:text-white text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* SECTION 1: LEAVE BALANCES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Paid Leave Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-lg border border-indigo-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Paid Leave (PTO)</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
              <Palmtree className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl font-extrabold">{leaveBalances.paidLeave} Days</p>
            <p className="text-xs text-slate-300">Remaining of {leaveBalances.paidLeaveTotal} days annual quota</p>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all"
              style={{ width: `${(leaveBalances.paidLeave / leaveBalances.paidLeaveTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Sick Leave Card */}
        <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sick Leave</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl font-extrabold text-slate-900">{leaveBalances.sickLeave} Days</p>
            <p className="text-xs text-slate-500">Remaining of {leaveBalances.sickLeaveTotal} days quota</p>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all"
              style={{ width: `${(leaveBalances.sickLeave / leaveBalances.sickLeaveTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Unpaid Leave Card */}
        <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unpaid Leave</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl font-extrabold text-slate-900">{leaveBalances.unpaidLeave}</p>
            <p className="text-xs text-slate-500">Subject to manager approval</p>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* SECTION 2 & 3 GRID: APPLY FORM & LEAVE HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* APPLY LEAVE FORM */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              Apply for Leave
            </h2>
            <p className="text-xs text-slate-500">Submit a leave request for HR review.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Leave Type Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Leave Type</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Paid Leave">Paid Leave (PTO)</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>

            {/* Start Date Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border ${
                  errors.startDate ? 'border-rose-500' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
              />
              {errors.startDate && <p className="text-[11px] font-semibold text-rose-600">{errors.startDate}</p>}
            </div>

            {/* End Date Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border ${
                  errors.endDate ? 'border-rose-500' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
              />
              {errors.endDate && <p className="text-[11px] font-semibold text-rose-600">{errors.endDate}</p>}
            </div>

            {/* Reason Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Reason for Leave</label>
              <textarea
                name="reason"
                rows="3"
                placeholder="State the purpose of your leave..."
                value={formData.reason}
                onChange={handleChange}
                className={`w-full p-3.5 text-xs font-medium rounded-xl bg-slate-50 border ${
                  errors.reason ? 'border-rose-500' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
              />
              {errors.reason && <p className="text-[11px] font-semibold text-rose-600">{errors.reason}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Apply Leave'}</span>
            </button>
          </form>
        </div>

        {/* LEAVE HISTORY TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Leave History & Status
              </h2>
              <p className="text-xs text-slate-500">Track current and past leave applications</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === status
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div>{item.leaveType}</div>
                        <span className="text-[11px] font-normal text-slate-400">ID: {item.id}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{item.dateRange || `${item.startDate} - ${item.endDate}`}</td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-600">{item.duration}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">{item.reason}</td>
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
      </div>
    </div>
  );
}
