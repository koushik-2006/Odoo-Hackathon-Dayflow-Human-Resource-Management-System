import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function LeaveRejectModal({ leave, onClose, onRejectSubmit }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for rejecting this leave request.');
      return;
    }
    setError('');
    onRejectSubmit(leave.id, reason);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Reject Leave Request</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Are you sure you want to reject <strong>{leave.employeeName}</strong>'s request for <strong>{leave.leaveType}</strong>?
            </p>
            <div className="form-group form-group-full">
              <label>Reason for rejection <span className="text-red">*</span></label>
              <textarea 
                className="filter-select"
                style={{ 
                  width: '100%', 
                  height: '100px', 
                  resize: 'none', 
                  backgroundImage: 'none', 
                  padding: '0.5rem' 
                }}
                placeholder="Enter rejection reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              {error && <span style={{ color: 'var(--accent-red)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</span>}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="action-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="action-btn-primary" style={{ backgroundColor: 'var(--accent-red)' }}>
              Reject Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
