import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function EmployeeEditModal({ employee, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: employee.name || '',
    department: employee.department || '',
    designation: employee.designation || '',
    joiningDate: employee.joiningDate || '',
    phone: employee.phone || '',
    address: employee.address || '',
    role: employee.role || '',
    status: employee.status || 'Active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Edit Employee</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select name="department" value={formData.department} onChange={handleChange}>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input 
                  type="text" 
                  name="designation" 
                  value={formData.designation} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="Admin">Admin</option>
                  <option value="HR">HR</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Joining Date</label>
                <input 
                  type="date" 
                  name="joiningDate" 
                  value={formData.joiningDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group form-group-full">
                <label>Address</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                />
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
