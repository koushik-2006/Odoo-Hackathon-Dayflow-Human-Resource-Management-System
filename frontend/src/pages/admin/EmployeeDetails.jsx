import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import EmployeeEditModal from '../../components/admin/EmployeeEditModal';

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab states: 'overview' | 'attendance' | 'leave' | 'payroll'
  const [activeTab, setActiveTab] = useState('overview');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Tab dynamic data states
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [payrollRecord, setPayrollRecord] = useState(null);

  useEffect(() => {
    async function loadEmployeeDetails() {
      try {
        setLoading(true);
        const empData = await adminApi.getEmployee(id);
        setEmployee(empData);

        // Fetch child tab items in parallel
        const [attData, payrollData] = await Promise.all([
          adminApi.getEmployeeAttendance(id),
          adminApi.getPayroll()
        ]);

        setAttendanceRecords(attData);
        const salaryInfo = payrollData.find(p => p.employeeId === id);
        setPayrollRecord(salaryInfo || null);

      } catch (err) {
        setError('Employee record not found or server issue occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEmployeeDetails();
  }, [id]);

  const handleUpdateSave = async (updatedFields) => {
    try {
      setIsEditModalOpen(false);
      setLoading(true);
      const updatedEmp = await adminApi.updateEmployee(id, updatedFields);
      setEmployee(updatedEmp);

      // Trigger toast notice
      setToastMessage('✓ Employee details updated successfully');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      alert('Failed to update employee details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !employee) {
    return (
      <div className="admin-loading-container">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading profile information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-container">
        <AlertCircle size={48} className="text-red" />
        <p>{error}</p>
        <button onClick={() => navigate('/admin/employees')} className="retry-btn">
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="employee-details-page fade-in">
      {/* Toast popup */}
      {toastMessage && (
        <div className="toast-success">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back navigations */}
      <div className="back-btn-container">
        <button onClick={() => navigate('/admin/employees')} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={16} />
          <span>Back to Employees</span>
        </button>
      </div>

      {/* Header Profile Info card */}
      <div className="profile-card-header">
        <div className="profile-header-info">
          <div className="big-avatar">
            {employee.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="header-text">
            <h2>{employee.name}</h2>
            <div className="header-meta">
              <span>{employee.id}</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span>{employee.department} • {employee.designation}</span>
            </div>
          </div>
        </div>
        <button className="action-btn-primary" onClick={() => setIsEditModalOpen(true)}>
          <Edit2 size={16} />
          <span>Edit Employee</span>
        </button>
      </div>

      {/* Tab navigation headers */}
      <div className="profile-tabs-header">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance
        </button>
        <button
          className={`tab-btn ${activeTab === 'leave' ? 'active' : ''}`}
          onClick={() => setActiveTab('leave')}
        >
          Leave
        </button>
        <button
          className={`tab-btn ${activeTab === 'payroll' ? 'active' : ''}`}
          onClick={() => setActiveTab('payroll')}
        >
          Payroll
        </button>
      </div>

      {/* Tab bodies */}
      <div className="tab-content-body">
        {activeTab === 'overview' && (
          <div className="details-grid">
            <div className="detail-section">
              <h3>Personal Details</h3>
              <div className="info-rows">
                <div className="info-row">
                  <span className="info-label">Full Name</span>
                  <span className="info-val">{employee.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date of Birth</span>
                  <span className="info-val">{employee.dob}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Gender</span>
                  <span className="info-val">{employee.gender}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Job Details</h3>
              <div className="info-rows">
                <div className="info-row">
                  <span className="info-label">Department</span>
                  <span className="info-val">{employee.department}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Designation</span>
                  <span className="info-val">{employee.designation}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Role Category</span>
                  <span className="info-val">{employee.role}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Joining Date</span>
                  <span className="info-val">{employee.joiningDate}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Employment Status</span>
                  <span className="info-val">{employee.status}</span>
                </div>
              </div>
            </div>

            <div className="detail-section" style={{ gridColumn: 'span 2' }}>
              <h3>Contact Details</h3>
              <div className="info-rows">
                <div className="info-row">
                  <span className="info-label">Email Address</span>
                  <span className="info-val">{employee.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone Number</span>
                  <span className="info-val">{employee.phone}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Residential Address</span>
                  <span className="info-val">{employee.address}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="detail-section">
            <h3>Attendance Log (Summary)</h3>
            {employee.attendance ? (
              <div className="info-rows">
                <div className="info-row">
                  <span className="info-label">Present Days</span>
                  <span className="info-val" style={{ color: 'var(--accent-green)' }}>{employee.attendance.present}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Absent Days</span>
                  <span className="info-val" style={{ color: 'var(--accent-red)' }}>{employee.attendance.absent}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">On Leave</span>
                  <span className="info-val" style={{ color: 'var(--accent-yellow)' }}>{employee.attendance.leave}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Half Day</span>
                  <span className="info-val" style={{ color: 'var(--accent-purple)' }}>{employee.attendance.halfDay}</span>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No summary records available.</p>
            )}
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="detail-section">
            <h3>Leave Inbox Details</h3>
            {employee.leave ? (
              <div className="info-rows">
                <div className="info-row">
                  <span className="info-label">Approved Leaves</span>
                  <span className="info-val" style={{ color: 'var(--accent-green)' }}>{employee.leave.approved}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Pending Approvals</span>
                  <span className="info-val" style={{ color: 'var(--accent-yellow)' }}>{employee.leave.pending}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Rejected Requests</span>
                  <span className="info-val" style={{ color: 'var(--accent-red)' }}>{employee.leave.rejected}</span>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No leave balance summary records available.</p>
            )}
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="detail-section">
            <h3>Salary Info Details</h3>
            {employee.payroll ? (
              <div className="info-rows">
                <div className="info-row">
                  <span className="info-label">Basic Salary</span>
                  <span className="info-val">₹{employee.payroll.basicSalary.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">House Rent Allowance (HRA)</span>
                  <span className="info-val">₹{employee.payroll.hra.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Special Allowances</span>
                  <span className="info-val">₹{employee.payroll.allowances.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">PF & Tax Deductions</span>
                  <span className="info-val">₹{employee.payroll.deductions.toLocaleString()}</span>
                </div>
                <div className="info-row" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                  <span className="info-label">Calculated Net Salary</span>
                  <span className="info-val" style={{ color: 'var(--accent-green)' }}>
                    ₹{employee.payroll.netSalary.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No payroll structure set for this employee.</p>
            )}
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      {isEditModalOpen && (
        <EmployeeEditModal
          employee={employee}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateSave}
        />
      )}
    </div>
  );
}
