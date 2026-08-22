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

  // Load API leaves on mount if available
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await getMyLeaves();
        if (data && Array.isArray(data)) {
          setLeaveHistory(data);
        }
      } catch (err) {
        console.warn('Using default leave history state:', err);
      }
    };
    fetchLeaves();
  }, []);

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Calculate day difference between two dates
  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (e < s) return 0;
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Frontend Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.leaveType) {
      newErrors.leaveType = 'Please select a leave type.';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required.';
    }

    if (formData.startDate && formData.endDate) {
      const s = new Date(formData.startDate);
      const e = new Date(formData.endDate);
      if (e < s) {
        newErrors.endDate = 'End date cannot be before start date.';
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required.';
    } else if (formData.reason.trim().length < 5) {
      newErrors.reason = 'Reason must be at least 5 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSuccessBanner(null);

    const daysCount = calculateDuration(formData.startDate, formData.endDate);

    try {
      const res = await applyLeave({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });

      const newLeave = {
        id: 'LV-' + Math.floor(1000 + Math.random() * 9000),
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        dateRange: `${formData.startDate} to ${formData.endDate}`,
        duration: `${daysCount} Day${daysCount > 1 ? 's' : ''}`,
        reason: formData.reason,
        appliedOn: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };

      setLeaveHistory([newLeave, ...leaveHistory]);
      setSuccessBanner('Leave application submitted successfully! Pending HR approval.');

      // Reset form
      setFormData({
        leaveType: 'Paid Leave',
        startDate: '',
        endDate: '',
        reason: '',
      });
    } catch (err) {
      setErrors({ general: 'Failed to submit leave request. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter history items
  const filteredLeaves = leaveHistory.filter((item) => {
    if (statusFilter === 'All') return true;
    return item.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Render Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending
          </span>
        );
      case 'Approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 w-fit">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Palmtree className="w-8 h-8 text-indigo-600" />
          Employee Leave Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Check your annual leave quota, submit time-off requests, and track approval status.
        </p>
      </div>

      {/* SECTION 1: LEAVE BALANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Paid Leave Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Paid Leave</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Palmtree className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{leaveBalances.paidLeave}</span>
            <span className="text-xs text-slate-400 font-medium">/ {leaveBalances.paidLeaveTotal} Days Available</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(leaveBalances.paidLeave / leaveBalances.paidLeaveTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Sick Leave Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sick Leave</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{leaveBalances.sickLeave}</span>
            <span className="text-xs text-slate-400 font-medium">/ {leaveBalances.sickLeaveTotal} Days Available</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(leaveBalances.sickLeave / leaveBalances.sickLeaveTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Unpaid Leave Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unpaid Leave</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{leaveBalances.unpaidLeave}</span>
            <span className="text-xs text-slate-400 font-medium">Subject to Manager Approval</span>
          </div>
          <p className="text-xs text-slate-500">No deduction from annual paid leaves quota.</p>
        </div>
      </div>

      {/* SECTION 2 & 3 GRID: APPLY LEAVE FORM & LEAVE HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SECTION 2: APPLY LEAVE FORM */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              Apply Leave
            </h2>
            <p className="text-xs text-slate-500">Fill out dates and details to submit for HR review.</p>
          </div>

          {/* Success Banner */}
          {successBanner && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* General Error Banner */}
          {errors.general && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Leave Type Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Leave Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Paid Leave">Paid Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
              {errors.leaveType && <p className="mt-1 text-xs text-rose-600">{errors.leaveType}</p>}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.startDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.startDate && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.endDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.endDate && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.endDate}</p>}
            </div>

            {/* Duration Display indicator */}
            {formData.startDate && formData.endDate && !errors.endDate && (
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center justify-between">
                <span>Calculated Duration:</span>
                <span>{calculateDuration(formData.startDate, formData.endDate)} Day(s)</span>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="reason"
                rows={3}
                placeholder="State the reason for your leave request..."
                value={formData.reason}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.reason ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.reason && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.reason}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all duration-200 shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{submitting ? 'Submitting...' : 'Apply Leave'}</span>
            </button>
          </form>
        </div>

        {/* SECTION 3: LEAVE HISTORY TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Leave History & Requests</h2>
              <p className="text-xs text-slate-500">Track current status of submitted time-off applications.</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table / List */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">Leave Type</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((item) => (
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
