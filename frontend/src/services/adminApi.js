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
  // Dashboard
  getDashboardStats: async () => {
    await delay(300);
    return dummyStats;
  },
  getAttendanceOverview: async () => {
    await delay(300);
    return dummyAttendanceOverview;
  },
  getLeaveOverview: async () => {
    await delay(300);
    return dummyLeaveOverview;
  },
  getDepartmentDistribution: async () => {
    await delay(300);
    return dummyDepartmentDistribution;
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
      console.error('Error fetching employees from backend, falling back to dummyData', err);
      return [...dummyEmployees];
    }
  },
  getEmployee: async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/employees/${id}`);
      const data = await res.json();
      if (data.success) {
        // Return object structure matching expectations
        return {
          ...data.employee,
          attendance: data.attendance,
          leave: data.leave,
          payroll: data.payroll
        };
      }
      throw new Error(data.message || 'Employee not found');
    } catch (err) {
      console.error('Error fetching employee from backend, falling back to dummyData', err);
      const emp = dummyEmployees.find(e => e.id === id);
      if (!emp) throw new Error('Employee not found');
      return { ...emp };
    }
  },
  updateEmployee: async (id, data) => {
    await delay(500);
    const idx = dummyEmployees.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Employee not found');
    dummyEmployees[idx] = { ...dummyEmployees[idx], ...data };
    return { ...dummyEmployees[idx] };
  },

  // Attendance
  getAttendance: async (filters = {}) => {
    await delay(400);
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
    await delay(300);
    return dummyAttendance.filter(a => a.employeeId === employeeId);
  },

  // Leaves
  getLeaves: async () => {
    await delay(400);
    return [...dummyLeaves];
  },
  approveLeave: async (id) => {
    await delay(500);
    const idx = dummyLeaves.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Leave request not found');
    dummyLeaves[idx] = { ...dummyLeaves[idx], status: 'Approved' };
    return { ...dummyLeaves[idx] };
  },
  rejectLeave: async (id, reason) => {
    await delay(500);
    const idx = dummyLeaves.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Leave request not found');
    dummyLeaves[idx] = { ...dummyLeaves[idx], status: 'Rejected', rejectionReason: reason };
    return { ...dummyLeaves[idx] };
  },

  // Payroll
  getPayroll: async () => {
    await delay(400);
    return [...dummyPayroll];
  },
  updatePayroll: async (employeeId, data) => {
    await delay(500);
    const idx = dummyPayroll.findIndex(p => p.employeeId === employeeId);
    if (idx === -1) throw new Error('Payroll record not found');
    dummyPayroll[idx] = { ...dummyPayroll[idx], ...data };
    return { ...dummyPayroll[idx] };
  }
};
