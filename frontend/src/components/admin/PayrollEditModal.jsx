import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PayrollEditModal({ record, onClose, onSave }) {
  const [basicSalary, setBasicSalary] = useState(record.basicSalary || 0);
  const [hra, setHra] = useState(record.hra || 0);
  const [allowances, setAllowances] = useState(record.allowances || 0);
  const [deductions, setDeductions] = useState(record.deductions || 0);
  const [netSalary, setNetSalary] = useState(0);

  // Live calculation preview
  useEffect(() => {
    const calcNet = Number(basicSalary) + Number(hra) + Number(allowances) - Number(deductions);
    setNetSalary(calcNet >= 0 ? calcNet : 0);
  }, [basicSalary, hra, allowances, deductions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(record.employeeId, {
      basicSalary: Number(basicSalary),
      hra: Number(hra),
      allowances: Number(allowances),
      deductions: Number(deductions)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Edit Payroll structure</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Configure base wages, HRA allowances, and deductions for <strong>{record.employeeName}</strong>.
            </p>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Basic Salary (₹)</label>
                <input 
                  type="number" 
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>HRA (₹)</label>
                <input 
                  type="number" 
                  value={hra}
                  onChange={(e) => setHra(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Allowances (₹)</label>
                <input 
                  type="number" 
                  value={allowances}
                  onChange={(e) => setAllowances(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Deductions (₹)</label>
                <input 
                  type="number" 
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="form-group form-group-full" style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Calculated Net Salary</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                    ₹{netSalary.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="action-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="action-btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
