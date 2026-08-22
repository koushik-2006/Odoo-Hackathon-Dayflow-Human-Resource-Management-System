import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import LeaveRejectModal from '../../components/admin/LeaveRejectModal';

export default function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tab states: 'Pending' | 'Approved' | 'Rejected'
  const [activeTab, setActiveTab] = useState('Pending');
  
  // Action overlays
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedRejectLeave, setSelectedRejectLeave] = useState(null);
  const [confirmApproveLeave, setConfirmApproveLeave] = useState(null);

  useEffect(() => {
    async function loadLeaves() {
      try {
        setLoading(true);
        const data = await adminApi.getLeaves();
        setLeaves(data);
      } catch (err) {
        setError('Failed to fetch leave request logs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLeaves();
  }, []);

  const handleApproveClick = (leave) => {
    setConfirmApproveLeave(leave);
  };

  const submitApprove = async () => {
    const targetId = confirmApproveLeave.id;
    setConfirmApproveLeave(null);
    try {
      setLoading(true);
      await adminApi.approveLeave(targetId);
      
      // Update local state
      setLeaves(prev => prev.map(l => l.id === targetId ? { ...l, status: 'Approved' } : l));
      setToastMessage('✓ Leave request approved successfully');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      alert('Failed to approve leave request.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = (leave) => {
    setSelectedRejectLeave(leave);
  };

  const submitReject = async (id, reason) => {
    setSelectedRejectLeave(null);
    try {
      setLoading(true);
      await adminApi.rejectLeave(id, reason);
      
      // Update local state
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected', rejectionReason: reason } : l));
      setToastMessage('✓ Leave request rejected');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      alert('Failed to reject leave request.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaves = leaves.filter(l => l.status === activeTab);

  // Tab counts
  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

  return (
    <div className="leaves-page fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-success">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="welcome-banner">
        <h2>Leave Management</h2>
        <p>Review leave applications, view request reason, and approve or reject submissions.</p>
      </div>

      {/* Tabs / Counts Grid */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem', cursor: 'pointer' }}>
        <div className={`stat-card ${activeTab === 'Pending' ? 'active' : ''}`} onClick={() => setActiveTab('Pending')} style={{ borderBottom: activeTab === 'Pending' ? '3px solid var(--accent-yellow)' : '' }}>
          <span className="stat-card-title">Pending requests</span>
          <span className="stat-card-value">{pendingCount}</span>
        </div>
        <div className={`stat-card ${activeTab === 'Approved' ? 'active' : ''}`} onClick={() => setActiveTab('Approved')} style={{ borderBottom: activeTab === 'Approved' ? '3px solid var(--accent-green)' : '' }}>
          <span className="stat-card-title">Approved requests</span>
          <span className="stat-card-value">{approvedCount}</span>
        </div>
        <div className={`stat-card ${activeTab === 'Rejected' ? 'active' : ''}`} onClick={() => setActiveTab('Rejected')} style={{ borderBottom: activeTab === 'Rejected' ? '3px solid var(--accent-red)' : '' }}>
          <span className="stat-card-title">Rejected requests</span>
          <span className="stat-card-value">{rejectedCount}</span>
        </div>
      </div>

      {/* Leave Directory List */}
      <div className="data-table-container">
        {loading ? (
          <div className="admin-loading-container" style={{ height: '200px' }}>
            <Loader2 className="animate-spin" size={32} />
            <p>Processing leave lists...</p>
          </div>
        ) : error ? (
          <div className="admin-error-container" style={{ height: '200px' }}>
            <AlertCircle size={32} className="text-red" />
            <p>{error}</p>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No {activeTab.toLowerCase()} leave requests found.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                {activeTab === 'Rejected' && <th>Rejection Reason</th>}
                {activeTab === 'Pending' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td><div style={{ fontWeight: 600 }}>{leave.employeeName}</div></td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{leave.days}</td>
                  <td>{leave.reason}</td>
                  {activeTab === 'Rejected' && <td style={{ color: 'var(--accent-red)' }}>{leave.rejectionReason}</td>}
                  {activeTab === 'Pending' && (
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="action-btn-primary" 
                          style={{ padding: '0.4rem 0.75rem', width: 'auto', backgroundColor: 'var(--accent-green)' }}
                          onClick={() => handleApproveClick(leave)}
                        >
                          Approve
                        </button>
                        <button 
                          className="action-btn-primary" 
                          style={{ padding: '0.4rem 0.75rem', width: 'auto', backgroundColor: 'var(--accent-red)' }}
                          onClick={() => handleRejectClick(leave)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Approve Dialog */}
      {confirmApproveLeave && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Approve Leave Request?</h3>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Do you want to approve <strong>{confirmApproveLeave.employeeName}</strong>'s request for <strong>{confirmApproveLeave.leaveType}</strong> from {confirmApproveLeave.startDate} to {confirmApproveLeave.endDate}?
              </p>
            </div>
            <div className="modal-footer">
              <button className="action-btn-secondary" onClick={() => setConfirmApproveLeave(null)}>
                Cancel
              </button>
              <button className="action-btn-primary" onClick={submitApprove} style={{ backgroundColor: 'var(--accent-green)' }}>
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection reason modal */}
      {selectedRejectLeave && (
        <LeaveRejectModal 
          leave={selectedRejectLeave}
          onClose={() => setSelectedRejectLeave(null)}
          onRejectSubmit={submitReject}
        />
      )}
    </div>
  );
}
