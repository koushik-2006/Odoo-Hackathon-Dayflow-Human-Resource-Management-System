/** Module 6 — Employee Attendance */
import React, { useState, useEffect } from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Search,
  UserCheck,
  Building,
  Timer
} from 'lucide-react';
import { checkIn, checkOut, getMyAttendance } from '../../services/attendanceService';

// Fallback Mock Data for Attendance Logs & Calendar
const MOCK_ATTENDANCE_LOGS = [
  { id: 1, dateFormatted: 'Aug 22, 2026', checkIn: '09:02 AM', checkOut: '05:48 PM', hours: '8h 46m', status: 'Present' },
  { id: 2, dateFormatted: 'Aug 21, 2026', checkIn: '08:55 AM', checkOut: '05:35 PM', hours: '8h 40m', status: 'Present' },
  { id: 3, dateFormatted: 'Aug 20, 2026', checkIn: '-', checkOut: '-', hours: '-', status: 'Leave' },
  { id: 4, dateFormatted: 'Aug 19, 2026', checkIn: '09:15 AM', checkOut: '01:45 PM', hours: '4h 30m', status: 'Half Day' },
  { id: 5, dateFormatted: 'Aug 18, 2026', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present' },
  { id: 6, dateFormatted: 'Aug 17, 2026', checkIn: '08:45 AM', checkOut: '05:30 PM', hours: '8h 45m', status: 'Present' },
  { id: 7, dateFormatted: 'Aug 14, 2026', checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' },
];

const MOCK_CALENDAR_DAYS = [
  { day: 1, status: 'P', note: 'Present (09:00 - 18:00)' },
  { day: 2, status: '-', note: 'Sunday Off' },
  { day: 3, status: 'P', note: 'Present (08:50 - 17:50)' },
  { day: 4, status: 'P', note: 'Present (09:05 - 18:05)' },
  { day: 5, status: 'L', note: 'Sick Leave' },
  { day: 6, status: 'P', note: 'Present (09:00 - 18:00)' },
  { day: 7, status: 'P', note: 'Present (08:55 - 17:55)' },
  { day: 8, status: '-', note: 'Saturday Off' },
  { day: 9, status: '-', note: 'Sunday Off' },
  { day: 10, status: 'P', note: 'Present (09:02 - 18:02)' },
  { day: 11, status: 'H', note: 'Half Day (09:00 - 13:00)' },
  { day: 12, status: 'P', note: 'Present (09:10 - 18:10)' },
  { day: 13, status: 'P', note: 'Present (08:55 - 17:55)' },
  { day: 14, status: 'A', note: 'Unexcused Absence' },
  { day: 15, status: '-', note: 'Saturday Off' },
  { day: 16, status: '-', note: 'Sunday Off' },
  { day: 17, status: 'P', note: 'Present (08:45 - 17:30)' },
  { day: 18, status: 'P', note: 'Present (09:00 - 18:00)' },
  { day: 19, status: 'H', note: 'Half Day (09:15 - 13:45)' },
  { day: 20, status: 'L', note: 'Approved Leave' },
  { day: 21, status: 'P', note: 'Present (08:55 - 17:35)' },
  { day: 22, status: 'P', note: 'Present (09:02 - 17:48)' },
  { day: 23, status: '-', note: 'Sunday Off' },
  { day: 24, status: 'P', note: 'Scheduled' },
  { day: 25, status: 'P', note: 'Scheduled' },
  { day: 26, status: 'P', note: 'Scheduled' },
  { day: 27, status: 'P', note: 'Scheduled' },
  { day: 28, status: 'P', note: 'Scheduled' },
  { day: 29, status: '-', note: 'Saturday Off' },
  { day: 30, status: '-', note: 'Sunday Off' },
  { day: 31, status: 'P', note: 'Scheduled' },
];

export default function Attendance() {
  const [todayAttendance, setTodayAttendance] = useState({
    checkInTime: '09:02 AM',
    checkOutTime: null,
    workingHours: '2h 46m',
    isCheckedIn: true,
    isCheckedOut: false,
  });

  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // History state
  const [attendanceLogs, setAttendanceLogs] = useState(MOCK_ATTENDANCE_LOGS);
  const [timeFilter, setTimeFilter] = useState('Daily'); // 'Daily' | 'Weekly' | 'Monthly'
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Calendar State
  const [calendarDays, setCalendarDays] = useState(MOCK_CALENDAR_DAYS);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  // Auto-dismiss toast notification
  const showNotification = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch initial attendance details from API
  useEffect(() => {
    const loadAttendanceData = async () => {
      try {
        const data = await getMyAttendance();
        if (data && data.today) {
          setTodayAttendance({
            checkInTime: data.today.checkIn || null,
            checkOutTime: data.today.checkOut || null,
            workingHours: data.today.workingHours || '0h 0m',
            isCheckedIn: !!data.today.checkIn,
            isCheckedOut: !!data.today.checkOut,
          });
        }
      } catch (err) {
        console.warn('Using default attendance state:', err);
      }
    };
    loadAttendanceData();
  }, []);

  // Handle Check In Action
  const handleCheckIn = async () => {
    setCheckInLoading(true);
    try {
      const res = await checkIn({ timestamp: new Date().toISOString() });
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      setTodayAttendance({
        checkInTime: now,
        checkOutTime: null,
        workingHours: '0h 01m',
        isCheckedIn: true,
        isCheckedOut: false,
      });

      // Add to table log
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        dateFormatted: 'Today (' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + ')',
        checkIn: now,
        checkOut: '-',
        hours: 'Logging...',
        status: 'Present',
      };
      setAttendanceLogs([newEntry, ...attendanceLogs]);

      showNotification('Successfully checked in at ' + now + '! Have a productive day.', 'success');
    } catch (err) {
      showNotification('Failed to check in. Please try again.', 'error');
    } finally {
      setCheckInLoading(false);
    }
  };

  // Handle Check Out Action
  const handleCheckOut = async () => {
    setCheckOutLoading(true);
    try {
      const res = await checkOut({ timestamp: new Date().toISOString() });
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      setTodayAttendance((prev) => ({
        ...prev,
        checkOutTime: now,
        isCheckedOut: true,
        workingHours: '8h 46m',
      }));

      // Update table log
      setAttendanceLogs((prev) =>
        prev.map((item, idx) =>
          idx === 0
            ? { ...item, checkOut: now, hours: '8h 46m', status: 'Present' }
            : item
        )
      );

      showNotification('Successfully checked out at ' + now + '. See you tomorrow!', 'success');
    } catch (err) {
      showNotification('Failed to check out. Please try again.', 'error');
    } finally {
      setCheckOutLoading(false);
    }
  };

  // Filter logs
  const filteredLogs = attendanceLogs.filter((log) => {
    const matchesStatus = statusFilter === 'All' || log.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = log.dateFormatted.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Render Status Badge Component
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Present</span>;
      case 'Absent':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Absent</span>;
      case 'Half Day':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Half Day</span>;
      case 'Leave':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Leave</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  // Render Calendar Status Badge
  const getCalendarStatusBadge = (code) => {
    switch (code) {
      case 'P':
        return <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">P</span>;
      case 'A':
        return <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">A</span>;
      case 'H':
        return <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">H</span>;
      case 'L':
        return <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">L</span>;
      default:
        return <span className="text-slate-300 font-bold text-xs">-</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl shadow-lg border text-sm font-medium flex items-center justify-between transition-all duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : 'bg-rose-900 text-rose-100 border-rose-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span>{toastMessage.msg}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs underline opacity-80 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-8 h-8 text-indigo-600" />
            Attendance Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track daily clock-ins, review work hour logs, and inspect your monthly attendance calendar.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
          <Building className="w-4 h-4 text-indigo-600" />
          <span>General Shift (09:00 AM - 06:00 PM)</span>
        </div>
      </div>

      {/* SECTION 1: TODAY'S ATTENDANCE CARD */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Real-time Status</span>
            <h2 className="text-xl font-bold text-slate-900">Today's Attendance</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${todayAttendance.isCheckedIn && !todayAttendance.isCheckedOut ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${todayAttendance.isCheckedIn && !todayAttendance.isCheckedOut ? 'bg-emerald-500' : 'bg-slate-500'}`} />
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {todayAttendance.isCheckedOut ? 'Checked Out' : todayAttendance.isCheckedIn ? 'Currently Active' : 'Not Checked In'}
            </span>
          </div>
        </div>

        {/* 3 Metrics: Check In, Check Out, Working Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <LogIn className="w-4 h-4 text-emerald-600" />
              Check In
            </span>
            <div className="text-2xl font-bold text-slate-900">{todayAttendance.checkInTime || '--:--'}</div>
            <p className="text-[11px] text-slate-400">Scheduled: 09:00 AM</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <LogOut className="w-4 h-4 text-rose-600" />
              Check Out
            </span>
            <div className="text-2xl font-bold text-slate-900">{todayAttendance.checkOutTime || '--:--'}</div>
            <p className="text-[11px] text-slate-400">Scheduled: 06:00 PM</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-indigo-600" />
              Working Hours
            </span>
            <div className="text-2xl font-bold text-indigo-600">{todayAttendance.workingHours}</div>
            <p className="text-[11px] text-slate-400">Target: 8h 00m</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            onClick={handleCheckIn}
            disabled={todayAttendance.isCheckedIn || checkInLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
              todayAttendance.isCheckedIn
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {checkInLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{todayAttendance.isCheckedIn ? 'CHECKED IN' : 'CHECK IN'}</span>
          </button>

          <button
            onClick={handleCheckOut}
            disabled={!todayAttendance.isCheckedIn || todayAttendance.isCheckedOut || checkOutLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
              !todayAttendance.isCheckedIn || todayAttendance.isCheckedOut
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
            }`}
          >
            {checkOutLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>{todayAttendance.isCheckedOut ? 'CHECKED OUT' : 'CHECK OUT'}</span>
          </button>

          <p className="text-xs text-slate-500 sm:ml-auto">
            {todayAttendance.isCheckedOut
              ? '✅ Today\'s shift completed.'
              : todayAttendance.isCheckedIn
              ? '⏱️ Shift active. Click Check Out at shift end.'
              : '👉 Click Check In when you begin work.'}
          </p>
        </div>
      </div>

      {/* SECTION 2: ATTENDANCE HISTORY TABLE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Attendance History</h2>
            <p className="text-xs text-slate-500">Detailed record of daily check-ins, check-outs, and total logged hours.</p>
          </div>

          {/* Filters & View Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setTimeRange('daily')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${timeRange === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeRange('weekly')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${timeRange === 'weekly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeRange('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${timeRange === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Monthly
              </button>
            </div>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Half Day">Half Day</option>
              <option value="Leave">Leave</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Check In</th>
                <th className="py-3.5 px-4">Check Out</th>
                <th className="py-3.5 px-4">Hours</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{log.dateFormatted}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{log.checkIn}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{log.checkOut}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{log.hours}</td>
                    <td className="py-3.5 px-4">{renderStatusBadge(log.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    No attendance records found for selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: ATTENDANCE CALENDAR VIEW */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              Monthly Attendance Calendar
            </h2>
            <p className="text-xs text-slate-500">Visual overview of attendance codes (P = Present, A = Absent, H = Half Day, L = Leave).</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-slate-900 min-w-[110px] text-center">{calendarMonth}</span>
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center">P</span>
            <span className="text-slate-600 font-medium">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">A</span>
            <span className="text-slate-600 font-medium">Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">H</span>
            <span className="text-slate-600 font-medium">Half Day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center">L</span>
            <span className="text-slate-600 font-medium">Leave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 font-bold">-</span>
            <span className="text-slate-400 font-medium">Weekend / Off</span>
          </div>
        </div>

        {/* Calendar Grid UI */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 bg-slate-50 text-center py-2.5 border-b border-slate-200 text-xs font-bold text-slate-600">
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div className="text-slate-400">SAT</div>
            <div className="text-slate-400">SUN</div>
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-white">
            {MOCK_CALENDAR_DAYS.map((item) => (
              <div
                key={item.day}
                onClick={() => setSelectedCalendarDay(item)}
                className={`p-3 min-h-[70px] flex flex-col items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${
                  selectedCalendarDay?.day === item.day ? 'ring-2 ring-indigo-500 bg-indigo-50/30' : ''
                }`}
              >
                <span className="text-xs font-semibold text-slate-700">{item.day}</span>
                <div>{getCalendarStatusBadge(item.status)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Day Details Inspector */}
        {selectedCalendarDay && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-900">August {selectedCalendarDay.day}, 2026:</span>
              <span className="text-slate-600">{selectedCalendarDay.note}</span>
            </div>
            <button
              onClick={() => setSelectedCalendarDay(null)}
              className="text-indigo-600 hover:underline font-semibold"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
