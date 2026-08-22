import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, AlertCircle, Eye } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true);
        const data = await adminApi.getEmployees();
        setEmployees(data);
      } catch (err) {
        setError('Failed to load employee list.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active': return 'status-badge status-active';
      case 'On Leave': return 'status-badge status-onleave';
      case 'Inactive': return 'status-badge status-inactive';
      default: return 'status-badge';
    }
  };

  // Frontend filtering logic based on multi-filter selections
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesRole = selectedRole === 'All' || emp.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-loading-container">
        <Loader2 className="animate-spin" size={48} />
        <p>Fetching employee records...</p>
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
    <div className="employees-page fade-in">
      <div className="welcome-banner">
        <h2>Employee Management</h2>
        <p>Search, filter, view details, and manage designations/roles.</p>
      </div>

      {/* Filter and search directory controls */}
      <div className="directory-controls">
        <div className="search-field">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, EMP ID, or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <span className="filter-label">Department</span>
            <select 
              className="filter-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">All</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="filter-item">
            <span className="filter-label">Role</span>
            <select 
              className="filter-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Admin">Admin</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <div className="filter-item">
            <span className="filter-label">Status</span>
            <select 
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="data-table-container">
        {filteredEmployees.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No employees match the specified criteria.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{emp.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                  </td>
                  <td>{emp.id}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.role}</td>
                  <td>
                    <span className={getStatusBadgeClass(emp.status)}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="nav-item" 
                      style={{ padding: '0.4rem 0.75rem', width: 'auto', display: 'inline-flex', gap: '0.4rem' }}
                      onClick={() => navigate(`/admin/employees/${emp.id}`)}
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
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
