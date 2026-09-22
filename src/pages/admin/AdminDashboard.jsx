import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  ClipboardList, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';
import { adminApi } from '../../services/adminApi';
import StatCard from '../../components/admin/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsRes, attendanceRes, leaveRes, deptRes] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getAttendanceOverview(),
          adminApi.getLeaveOverview(),
          adminApi.getDepartmentDistribution()
        ]);
        setStats(statsRes);
        setAttendanceData(attendanceRes);
        setLeaveData(leaveRes);
        setDeptData(deptRes);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-container">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading overview stats & charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-container">
        <AlertCircle size={48} className="text-red" />
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page fade-in">
      <div className="welcome-banner">
        <h2>Welcome back, Admin 👋</h2>
        <p>Here is today's workforce overview and distribution.</p>
      </div>

      {/* Grid for Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          trend="+4"
          trendType="up"
          description={stats.totalEmployeesChange}
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          trend="87%"
          trendType="info"
          description={stats.presentTodayChange}
        />
        <StatCard
          title="On Leave"
          value={stats.onLeave}
          icon={UserMinus}
          trend="3"
          trendType="info"
          description={stats.onLeaveChange}
        />
        <StatCard
          title="Pending Leave Requests"
          value={stats.pendingLeaves}
          icon={ClipboardList}
          trend="8"
          trendType="down"
          description={stats.pendingLeavesChange}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="charts-main-grid">
        {/* Attendance Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Attendance Overview</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131b2e', borderColor: 'rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="custom-legend">
            {attendanceData.map((entry, index) => (
              <div key={index} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: entry.fill }}></span>
                <span className="legend-label">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Pie Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Leave Request Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131b2e', borderColor: 'rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="custom-legend">
            {leaveData.map((entry, index) => (
              <div key={index} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: entry.fill }}></span>
                <span className="legend-label">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width Department distribution */}
      <div className="chart-card full-width-chart">
        <h3 className="chart-title">Department Distribution</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#131b2e', borderColor: 'rgba(255,255,255,0.1)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
