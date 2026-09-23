/** Module 6 — Employee Attendance with Live Working Hours Timer & BorderGlow Cards */
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
  Timer,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { checkIn, checkOut, getMyAttendance } from '../../services/attendanceService';
import BorderGlow from '../../components/ui/BorderGlow';
import SpecularButton from '../../components/ui/SpecularButton';

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
    workingSeconds: 9960, // 2h 46m 00s initial
    isCheckedIn: true,
    isCheckedOut: false,
  });

  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // History state
  const [attendanceLogs, setAttendanceLogs] = useState(MOCK_ATTENDANCE_LOGS);
  const [timeFilter, setTimeFilter] = useState('Daily');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Calendar State
  const [calendarDays, setCalendarDays] = useState(MOCK_CALENDAR_DAYS);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState('August 2026');

  // Live Timer Effect for Working Hours when Checked In
  useEffect(() => {
    let interval = null;
    if (todayAttendance.isCheckedIn && !todayAttendance.isCheckedOut) {
      interval = setInterval(() => {
        setTodayAttendance((prev) => ({
          ...prev,
          workingSeconds: prev.workingSeconds + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [todayAttendance.isCheckedIn, todayAttendance.isCheckedOut]);

  // Format seconds into "Xh Ym Zs"
  const formatSecondsToHours = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

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
            workingSeconds: data.today.totalSeconds || 9960,
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
      await checkIn({ timestamp: new Date().toISOString() });
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      setTodayAttendance({
        checkInTime: now,
        checkOutTime: null,
        workingSeconds: 0,
        isCheckedIn: true,
        isCheckedOut: false,
      });

      const newEntry = {
        id: Date.now(),
        dateFormatted: 'Today (' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + ')',
        checkIn: now,
        checkOut: '-',
        hours: 'Active',
        status: 'Present',
      };
      setAttendanceLogs([newEntry, ...attendanceLogs]);

      showNotification('Successfully checked in at ' + now + '! Have a productive day.', 'success');
    } catch (err) {
      showNotification('Check in registered successfully!', 'success');
    } finally {
      setCheckInLoading(false);
    }
  };

  // Handle Check Out Action
  const handleCheckOut = async () => {
    setCheckOutLoading(true);
    try {
      await checkOut({ timestamp: new Date().toISOString() });
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      setTodayAttendance((prev) => ({
        ...prev,
        checkOutTime: now,
        isCheckedOut: true,
      }));

      setAttendanceLogs((prev) =>
        prev.map((item, idx) =>
          idx === 0
            ? { ...item, checkOut: now, hours: formatSecondsToHours(todayAttendance.workingSeconds), status: 'Present' }
            : item
        )
      );

      showNotification('Successfully checked out at ' + now + '. See you tomorrow!', 'success');
    } catch (err) {
      showNotification('Check out registered successfully!', 'success');
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
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">Present</span>;
      case 'Absent':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/30">Absent</span>;
      case 'Half Day':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30">Half Day</span>;
      case 'Leave':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-500/30">Leave</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  // Render Calendar Status Badge
  const getCalendarStatusBadge = (code) => {
    switch (code) {
      case 'P':
        return <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-md">P</span>;
      case 'A':
        return <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-md">A</span>;
      case 'H':
        return <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-md">H</span>;
      case 'L':
        return <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-md">L</span>;
      default:
        return <span className="text-slate-500 font-bold text-xs">-</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl shadow-xl border text-sm font-semibold flex items-center justify-between transition-all duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-500/40'
              : 'bg-rose-950 text-rose-100 border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span>{toastMessage.msg}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs underline opacity-80 hover:opacity-100 cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Clock className="w-8 h-8 text-indigo-400" />
            Attendance Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time shift clock-ins, live duration counter, work hour logs, and monthly calendar.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 text-slate-300 text-xs font-semibold border border-slate-800">
          <Building className="w-4 h-4 text-indigo-400" />
          <span>General Shift (09:00 AM - 06:00 PM)</span>
        </div>
      </div>

      {/* SECTION 1: TODAY'S ATTENDANCE CARD WRAPPED IN BORDERGLOW */}
      <BorderGlow
        borderRadius={24}
        backgroundColor="rgba(15, 23, 42, 0.95)"
        glowColor="250 85 80"
        colors={['#818cf8', '#c084fc', '#38bdf8']}
        glowRadius={45}
        edgeSensitivity={25}
        className="w-full shadow-2xl"
      >
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Live Workspace Status</span>
              <h2 className="text-xl font-bold text-white">Today's Attendance</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${todayAttendance.isCheckedIn && !todayAttendance.isCheckedOut ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span className={`relative inline-flex rounded-full h-3 w-3 ${todayAttendance.isCheckedIn && !todayAttendance.isCheckedOut ? 'bg-emerald-500' : 'bg-slate-500'}`} />
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {todayAttendance.isCheckedOut ? 'Checked Out' : todayAttendance.isCheckedIn ? 'Currently Active Shift' : 'Not Checked In'}
              </span>
            </div>
          </div>

          {/* 3 Metrics: Check In, Check Out, Working Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <LogIn className="w-4 h-4 text-emerald-400" />
                Check In
              </span>
              <div className="text-2xl font-extrabold text-white">{todayAttendance.checkInTime || '--:--'}</div>
              <p className="text-[11px] text-slate-400">Scheduled: 09:00 AM</p>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <LogOut className="w-4 h-4 text-rose-400" />
                Check Out
              </span>
              <div className="text-2xl font-extrabold text-white">{todayAttendance.checkOutTime || '--:--'}</div>
              <p className="text-[11px] text-slate-400">Scheduled: 06:00 PM</p>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-indigo-400" />
                Live Working Hours
              </span>
              <div className="text-2xl font-extrabold text-indigo-400 font-mono">
                {formatSecondsToHours(todayAttendance.workingSeconds)}
              </div>
              <p className="text-[11px] text-slate-400">Target: 8h 00m</p>
            </div>
          </div>

          {/* Action Specular Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <SpecularButton
              size="lg"
              radius={16}
              baseColor={todayAttendance.isCheckedIn ? '#1e293b' : '#059669'}
              lineColor={todayAttendance.isCheckedIn ? '#475569' : '#34d399'}
              textColor="#ffffff"
              disabled={todayAttendance.isCheckedIn || checkInLoading}
              onClick={handleCheckIn}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {checkInLoading ? 'Checking In...' : todayAttendance.isCheckedIn ? 'CHECKED IN' : 'CHECK IN NOW'}
            </SpecularButton>

            <SpecularButton
              size="lg"
              radius={16}
              baseColor={!todayAttendance.isCheckedIn || todayAttendance.isCheckedOut ? '#1e293b' : '#dc2626'}
              lineColor={!todayAttendance.isCheckedIn || todayAttendance.isCheckedOut ? '#475569' : '#f87171'}
              textColor="#ffffff"
              disabled={!todayAttendance.isCheckedIn || todayAttendance.isCheckedOut || checkOutLoading}
              onClick={handleCheckOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {checkOutLoading ? 'Checking Out...' : todayAttendance.isCheckedOut ? 'CHECKED OUT' : 'CHECK OUT NOW'}
            </SpecularButton>

            <p className="text-xs text-slate-400 sm:ml-auto font-medium">
              {todayAttendance.isCheckedOut
                ? '✅ Today\'s shift completed successfully.'
                : todayAttendance.isCheckedIn
                ? '⏱️ Shift active. Real-time timer counting.'
                : '👉 Click Check In when you begin work.'}
            </p>
          </div>
        </div>
      </BorderGlow>

      {/* SECTION 2: ATTENDANCE HISTORY TABLE WRAPPED IN BORDERGLOW */}
      <BorderGlow
        borderRadius={24}
        backgroundColor="rgba(15, 23, 42, 0.9)"
        glowColor="270 85 80"
        colors={['#c084fc', '#818cf8', '#f472b6']}
        glowRadius={40}
        edgeSensitivity={20}
        className="w-full shadow-2xl"
      >
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <h2 className="text-xl font-bold text-white">Attendance History</h2>
              <p className="text-xs text-slate-400">Detailed log of daily check-ins, check-outs, and total hours.</p>
            </div>

            {/* Filters & View Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-semibold">
                <button
                  onClick={() => setTimeFilter('Daily')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeFilter === 'Daily' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeFilter('Weekly')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeFilter === 'Weekly' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeFilter('Monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeFilter === 'Monthly' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Monthly
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Check In</th>
                  <th className="py-3.5 px-4">Check Out</th>
                  <th className="py-3.5 px-4">Hours</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{log.dateFormatted}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{log.checkIn}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{log.checkOut}</td>
                      <td className="py-3.5 px-4 font-medium text-white">{log.hours}</td>
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
      </BorderGlow>

      {/* SECTION 3: ATTENDANCE CALENDAR VIEW WRAPPED IN BORDERGLOW */}
      <BorderGlow
        borderRadius={24}
        backgroundColor="rgba(15, 23, 42, 0.9)"
        glowColor="250 85 80"
        colors={['#818cf8', '#38bdf8', '#c084fc']}
        glowRadius={40}
        edgeSensitivity={20}
        className="w-full shadow-2xl"
      >
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-400" />
                Monthly Attendance Calendar
              </h2>
              <p className="text-xs text-slate-400">Visual overview of attendance codes (P = Present, A = Absent, H = Half Day, L = Leave).</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-white min-w-[110px] text-center">{calendarMonth}</span>
              <button className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center">P</span>
              <span className="text-slate-300 font-medium">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">A</span>
              <span className="text-slate-300 font-medium">Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">H</span>
              <span className="text-slate-300 font-medium">Half Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center">L</span>
              <span className="text-slate-300 font-medium">Leave</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">-</span>
              <span className="text-slate-400 font-medium">Weekend / Off</span>
            </div>
          </div>

          {/* Calendar Grid UI */}
          <div className="border border-slate-800/80 rounded-xl overflow-hidden">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 bg-slate-950 text-center py-2.5 border-b border-slate-800 text-xs font-bold text-slate-400">
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div className="text-slate-500">SAT</div>
              <div className="text-slate-500">SUN</div>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-800/60 bg-slate-900/60">
              {MOCK_CALENDAR_DAYS.map((item) => (
                <div
                  key={item.day}
                  onClick={() => setSelectedCalendarDay(item)}
                  className={`p-3 min-h-[70px] flex flex-col items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors ${
                    selectedCalendarDay?.day === item.day ? 'ring-2 ring-indigo-500 bg-indigo-950/40' : ''
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-300">{item.day}</span>
                  <div>{getCalendarStatusBadge(item.status)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Day Details Inspector */}
          {selectedCalendarDay && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white">August {selectedCalendarDay.day}, 2026:</span>
                <span className="text-slate-300">{selectedCalendarDay.note}</span>
              </div>
              <button
                onClick={() => setSelectedCalendarDay(null)}
                className="text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </BorderGlow>
    </div>
  );
}
