import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CreditCard, ChevronRight } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export default function EmployeePayroll() {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // For simulation: we let user switch mock tokens to view different personal structures
  const [mockUserToken, setMockUserToken] = useState('EMP001');

  useEffect(() => {
    async function fetchMyPayroll() {
      try {
        setLoading(true);
        const data = await adminApi.getMyPayroll(mockUserToken);
        setPayroll(data);
      } catch (err) {
        setError('Failed to fetch personal payroll statements.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyPayroll();
  }, [mockUserToken]);

  return (
    <div className="payroll-personal-page fade-in" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div className="welcome-banner" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>My Salary Details 💳</h2>
        <p>View basic wages, HRA distribution, allowances, deductions and calculated Net values.</p>
        
        {/* Mock user token selector for simulation dashboard */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Simulate Auth User:</span>
          <select 
            className="filter-select" 
            style={{ padding: '0.25rem 1.5rem 0.25rem 0.5rem', fontSize: '0.8rem' }}
            value={mockUserToken} 
            onChange={(e) => setMockUserToken(e.target.value)}
          >
            <option value="EMP001">John Doe (EMP001)</option>
            <option value="EMP002">Jane Doe (EMP002)</option>
            <option value="EMP003">Bob Smith (EMP003)</option>
            <option value="EMP004">Alice Cooper (EMP004)</option>
            <option value="EMP005">Charlie Brown (EMP005)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-container" style={{ height: '200px' }}>
          <Loader2 className="animate-spin" size={32} />
          <p>Fetching personal salary slip...</p>
        </div>
      ) : error ? (
        <div className="admin-error-container" style={{ height: '200px' }}>
          <AlertCircle size={32} className="text-red" />
          <p>{error}</p>
        </div>
      ) : payroll ? (
        <div className="detail-section fade-in" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CreditCard size={24} style={{ color: 'var(--accent-blue)' }} />
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Active Payroll Specs</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {payroll.id || 'N/A'}</span>
          </div>

          <div className="info-rows">
            <div className="info-row" style={{ padding: '0.5rem 0' }}>
              <span className="info-label">Basic Salary</span>
              <span className="info-val">₹{payroll.basicSalary.toLocaleString()}</span>
            </div>
            <div className="info-row" style={{ padding: '0.5rem 0' }}>
              <span className="info-label">House Rent Allowance (HRA)</span>
              <span className="info-val">₹{payroll.hra.toLocaleString()}</span>
            </div>
            <div className="info-row" style={{ padding: '0.5rem 0' }}>
              <span className="info-label">Special Allowances</span>
              <span className="info-val">₹{payroll.allowances.toLocaleString()}</span>
            </div>
            <div className="info-row" style={{ padding: '0.5rem 0', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
              <span className="info-label">PF & Tax Deductions</span>
              <span className="info-val" style={{ color: 'var(--accent-red)' }}>- ₹{payroll.deductions.toLocaleString()}</span>
            </div>
            <div className="info-row" style={{ padding: '1rem 0 0.5rem 0', fontWeight: 'bold' }}>
              <span className="info-label" style={{ fontSize: '1.05rem' }}>Calculated Net Salary</span>
              <span className="info-val" style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>
                ₹{payroll.netSalary.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Effective From:</span>
              <span style={{ fontWeight: 600 }}>{payroll.effectiveFrom}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
