import React, { useState, useEffect } from 'react';
import { Search, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-08-22'); // default to mock data date
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    async function loadAttendanceData() {
      try {
        setLoading(true);
        // We pass filters directly to simulated API
        const data = await adminApi.getAttendance({
          search: searchQuery,
          department: selectedDept,
          status: selectedStatus
        });
        setAttendance(data);
      } catch (err) {
        setError('Failed to load attendance logs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAttendanceData();
  }, [searchQuery, selectedDept, selectedStatus]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Present': return 'status-badge status-active';
      case 'Leave': return 'status-badge status-onleave';
      case 'Absent': return 'status-badge status-inactive';
      case 'Late': return 'status-badge status-late';
      case 'Half Day': return 'status-badge status-halfday';
      default: return 'status-badge';
    }
  };

  return (
    <div className="attendance-page fade-in">
      <div className="welcome-banner">
        <h2>Attendance Management</h2>
        <p>Monitor daily logs, working hours, and check-in times across departments.</p>
      </div>

      {/* Filter and control panel */}
      <div className="directory-controls">
        <div className="search-field">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search employee by name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <span className="filter-label">Select Date</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="date" 
                className="filter-select"
                style={{ paddingRight: '1rem' }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-item">
            <span className="filter-label">Department</span>
            <select 
              className="filter-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="filter-item">
            <span className="filter-label">Status</span>
            <select 
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
              <option value="Half Day">Half Day</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Attendance List */}
      <div className="data-table-container">
        {loading ? (
          <div className="admin-loading-container" style={{ height: '200px' }}>
            <Loader2 className="animate-spin" size={32} />
            <p>Filtering attendance logs...</p>
          </div>
        ) : error ? (
          <div className="admin-error-container" style={{ height: '200px' }}>
            <AlertCircle size={32} className="text-red" />
            <p>{error}</p>
          </div>
        ) : attendance.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No attendance entries matching your query for {selectedDate}.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{log.employeeName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.employeeId}</div>
                  </td>
                  <td>{selectedDate}</td>
                  <td>{log.checkIn}</td>
                  <td>{log.checkOut}</td>
                  <td>{log.hours}</td>
                  <td>
                    <span className={getStatusBadgeClass(log.status)}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
