import { 
  dummyStats, 
  dummyAttendanceOverview, 
  dummyLeaveOverview, 
  dummyDepartmentDistribution, 
  dummyEmployees,
  dummyAttendance,
  dummyLeaves,
  dummyPayroll
} from '../data/dummyAdminData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const adminApi = {
  // Dashboard Metrics & Charts
  getDashboardStats: async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/dashboard/stats');
      const data = await res.json();
      if (data.success) {
        return data;
      }
      return dummyStats;
    } catch (err) {
      console.warn('Backend endpoint /api/admin/dashboard/stats unreachable. Using fallback stats.');
      return dummyStats;
    }
  },
  getAttendanceOverview: async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/dashboard/attendance-summary');
      const data = await res.json();
      if (data.success) {
        return [
          { name: 'Present', value: data.present, fill: '#10b981' },
          { name: 'Absent', value: data.absent, fill: '#ef4444' },
          { name: 'Leave', value: data.leave, fill: '#f59e0b' },
          { name: 'Half Day', value: data.halfDay, fill: '#8b5cf6' }
        ];
      }
      return dummyAttendanceOverview;
    } catch (err) {
      return dummyAttendanceOverview;
    }
  },
  getLeaveOverview: async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/dashboard/leave-summary');
      const data = await res.json();
      if (data.success) {
        return [
          { name: 'Approved', value: data.approved, fill: '#10b981' },
          { name: 'Pending', value: data.pending, fill: '#f59e0b' },
          { name: 'Rejected', value: data.rejected, fill: '#ef4444' }
        ];
      }
      return dummyLeaveOverview;
    } catch (err) {
      return dummyLeaveOverview;
    }
  },
  getDepartmentDistribution: async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/dashboard/departments');
      const data = await res.json();
      if (data.success) {
        return data.departments;
      }
      return dummyDepartmentDistribution;
    } catch (err) {
      return dummyDepartmentDistribution;
    }
  },

  // Employees
  getEmployees: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.status) queryParams.append('status', filters.status);
      
      const res = await fetch(`http://localhost:5000/api/admin/employees?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        return data.employees;
      }
      return [];
    } catch (err) {
      console.warn('Error fetching employees from backend, falling back to local dataset', err);
      return [...dummyEmployees];
    }
  },
  getEmployee: async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/employees/${id}`);
      const data = await res.json();
      if (data.success) {
        return {
          ...data.employee,
          attendance: data.attendance,
          leave: data.leave,
          payroll: data.payroll
        };
      }
      throw new Error(data.message || 'Employee not found');
    } catch (err) {
      const emp = dummyEmployees.find(e => e.id === id);
      if (!emp) throw new Error('Employee not found');
      return { ...emp };
    }
  },
  updateEmployee: async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (data.success) {
        return data.employee;
      }
      throw new Error(data.message || 'Failed to update employee details');
    } catch (err) {
      const idx = dummyEmployees.findIndex(e => e.id === id);
      if (idx === -1) throw new Error('Employee not found');
      dummyEmployees[idx] = { ...dummyEmployees[idx], ...updatedFields };
      return { ...dummyEmployees[idx] };
    }
  },
  toggleEmployeeStatus: async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/employees/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        return data.employee;
      }
      throw new Error(data.message || 'Failed to update status');
    } catch (err) {
      const idx = dummyEmployees.findIndex(e => e.id === id);
      if (idx === -1) throw new Error('Employee not found');
      dummyEmployees[idx].status = newStatus;
      return { ...dummyEmployees[idx] };
    }
  },

  // Attendance
  getAttendance: async (filters = {}) => {
    await delay(200);
    let list = [...dummyAttendance];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(a => a.employeeName.toLowerCase().includes(q) || a.employeeId.toLowerCase().includes(q));
    }
    if (filters.department && filters.department !== 'All') {
      list = list.filter(a => a.department === filters.department);
    }
    if (filters.status && filters.status !== 'All') {
      list = list.filter(a => a.status === filters.status);
    }
    return list;
  },
  getEmployeeAttendance: async (employeeId) => {
    await delay(200);
    return dummyAttendance.filter(a => a.employeeId === employeeId);
  },

  // Leaves
  getLeaves: async () => {
    await delay(200);
    return [...dummyLeaves];
  },
  approveLeave: async (id) => {
    await delay(300);
    const idx = dummyLeaves.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Leave request not found');
    dummyLeaves[idx] = { ...dummyLeaves[idx], status: 'Approved' };
    return { ...dummyLeaves[idx] };
  },
  rejectLeave: async (id, reason) => {
    await delay(300);
    const idx = dummyLeaves.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Leave request not found');
    dummyLeaves[idx] = { ...dummyLeaves[idx], status: 'Rejected', rejectionReason: reason };
    return { ...dummyLeaves[idx] };
  },

  // Payroll
  getPayroll: async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/payroll');
      const data = await res.json();
      if (data.success) {
        return data.payroll;
      }
      return [];
    } catch (err) {
      return [...dummyPayroll];
    }
  },
  updatePayroll: async (employeeId, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/payroll/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (data.success) {
        return data.payroll;
      }
      throw new Error(data.message || 'Failed to update payroll specifications');
    } catch (err) {
      const idx = dummyPayroll.findIndex(p => p.employeeId === employeeId);
      if (idx === -1) throw new Error('Payroll record not found');
      dummyPayroll[idx] = { ...dummyPayroll[idx], ...updatedFields };
      return { ...dummyPayroll[idx] };
    }
  },
  getMyPayroll: async (mockTokenId = 'EMP001') => {
    try {
      const res = await fetch('http://localhost:5000/api/payroll/me', {
        headers: {
          'Authorization': `Bearer ${mockTokenId}`
        }
      });
      const data = await res.json();
      if (data.success) {
        return data.payroll;
      }
      throw new Error(data.message || 'Failed to load personal payroll');
    } catch (err) {
      const rec = dummyPayroll.find(p => p.employeeId === mockTokenId);
      if (!rec) throw new Error('Payroll not found');
      return {
        ...rec,
        effectiveFrom: '2026-08-01',
        netSalary: rec.basicSalary + rec.hra + rec.allowances - rec.deductions
      };
    }
  }
};
