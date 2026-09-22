import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, Edit, CheckCircle } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import PayrollEditModal from '../../components/admin/PayrollEditModal';

export default function AdminPayroll() {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function loadPayrollData() {
      try {
        setLoading(true);
        const data = await adminApi.getPayroll();
        setPayroll(data);
      } catch (err) {
        setError('Failed to fetch payroll distribution lists.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPayrollData();
  }, []);

  const handleEditClick = (record) => {
    setSelectedRecord(record);
  };

  const handleSavePayroll = async (employeeId, updatedData) => {
    setSelectedRecord(null);
    try {
      setLoading(true);
      await adminApi.updatePayroll(employeeId, updatedData);
      
      // Update local state table
      setPayroll(prev => prev.map(p => p.employeeId === employeeId ? { ...p, ...updatedData } : p));
      
      setToastMessage('✓ Payroll structures updated successfully');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      alert('Failed to update payroll specifications.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateNetSalary = (record) => {
    return record.basicSalary + record.hra + record.allowances - record.deductions;
  };

  const filteredPayroll = payroll.filter(p => 
    p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="payroll-page fade-in">
      {/* Toast popup */}
      {toastMessage && (
        <div className="toast-success">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="welcome-banner">
        <h2>Payroll Management</h2>
        <p>Monitor wage components, tax deductions, and distribute employee payouts.</p>
      </div>

      {/* Directory controls */}
      <div className="directory-controls">
        <div className="search-field">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search payroll by employee name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Payroll Table */}
      <div className="data-table-container">
        {loading ? (
          <div className="admin-loading-container" style={{ height: '200px' }}>
            <Loader2 className="animate-spin" size={32} />
            <p>Refactoring payroll entries...</p>
          </div>
        ) : error ? (
          <div className="admin-error-container" style={{ height: '200px' }}>
            <AlertCircle size={32} className="text-red" />
            <p>{error}</p>
          </div>
        ) : filteredPayroll.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No payroll specifications match your query.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Basic Salary</th>
                <th>HRA</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayroll.map((rec) => (
                <tr key={rec.employeeId}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{rec.employeeName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.employeeId}</div>
                  </td>
                  <td>₹{rec.basicSalary.toLocaleString()}</td>
                  <td>₹{rec.hra.toLocaleString()}</td>
                  <td>₹{rec.allowances.toLocaleString()}</td>
                  <td>₹{rec.deductions.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-green)' }}>
                    ₹{calculateNetSalary(rec).toLocaleString()}
                  </td>
                  <td>
                    <button 
                      className="nav-item" 
                      style={{ padding: '0.4rem 0.75rem', width: 'auto', display: 'inline-flex', gap: '0.4rem' }}
                      onClick={() => handleEditClick(rec)}
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit specifications modal overlay */}
      {selectedRecord && (
        <PayrollEditModal 
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onSave={handleSavePayroll}
        />
      )}
    </div>
  );
}
