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
  getEmployees: async () => {
    await delay(400);
    return [...dummyEmployees];
  },
  getEmployee: async (id) => {
    await delay(300);
    const emp = dummyEmployees.find(e => e.id === id);
    if (!emp) throw new Error('Employee not found');
    return { ...emp };
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
