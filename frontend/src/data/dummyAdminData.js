// Admin Dummy Data

export const dummyStats = {
  totalEmployees: 124,
  presentToday: 108,
  onLeave: 8,
  pendingLeaves: 8,
  totalEmployeesChange: "+4 this month",
  presentTodayChange: "87% attendance rate",
  onLeaveChange: "3 approved for today",
  pendingLeavesChange: "Requires attention"
};

export const dummyAttendanceOverview = [
  { name: 'Present', value: 108, fill: '#10b981' },
  { name: 'Absent', value: 6, fill: '#ef4444' },
  { name: 'Leave', value: 8, fill: '#f59e0b' },
  { name: 'Half Day', value: 2, fill: '#8b5cf6' }
];

export const dummyLeaveOverview = [
  { name: 'Approved', value: 24, fill: '#10b981' },
  { name: 'Pending', value: 8, fill: '#f59e0b' },
  { name: 'Rejected', value: 4, fill: '#ef4444' }
];

export const dummyDepartmentDistribution = [
  { name: 'IT', count: 55 },
  { name: 'HR', count: 20 },
  { name: 'Finance', count: 25 },
  { name: 'Marketing', count: 24 }
];

export const dummyEmployees = [
  { id: 'EMP001', name: 'John Doe', email: 'john@example.com', phone: '9876543210', department: 'IT', designation: 'Developer', role: 'Employee', status: 'Active', joiningDate: '2025-01-10', gender: 'Male', dob: '1995-05-15', address: 'Chennai' },
  { id: 'EMP002', name: 'Jane Doe', email: 'jane@example.com', phone: '9876543211', department: 'HR', designation: 'Manager', role: 'HR', status: 'Active', joiningDate: '2024-03-12', gender: 'Female', dob: '1992-08-22', address: 'Mumbai' },
  { id: 'EMP003', name: 'Bob Smith', email: 'bob@example.com', phone: '9876543212', department: 'Finance', designation: 'Analyst', role: 'Manager', status: 'Active', joiningDate: '2023-11-01', gender: 'Male', dob: '1988-11-30', address: 'Bangalore' },
  { id: 'EMP004', name: 'Alice Cooper', email: 'alice@example.com', phone: '9876543213', department: 'Marketing', designation: 'Lead', role: 'Employee', status: 'On Leave', joiningDate: '2025-02-15', gender: 'Female', dob: '1997-04-05', address: 'Delhi' },
  { id: 'EMP005', name: 'Charlie Brown', email: 'charlie@example.com', phone: '9876543214', department: 'IT', designation: 'QA Specialist', role: 'Employee', status: 'Inactive', joiningDate: '2024-06-20', gender: 'Male', dob: '1994-02-10', address: 'Pune' }
];

export const dummyAttendance = [
  { id: '1', employeeId: 'EMP001', employeeName: 'John Doe', date: '2026-08-22', checkIn: '09:02', checkOut: '17:48', hours: '8h 46m', status: 'Present', department: 'IT' },
  { id: '2', employeeId: 'EMP002', employeeName: 'Jane Doe', date: '2026-08-22', checkIn: '08:55', checkOut: '17:05', hours: '8h 10m', status: 'Present', department: 'HR' },
  { id: '3', employeeId: 'EMP003', employeeName: 'Bob Smith', date: '2026-08-22', checkIn: '09:15', checkOut: '18:00', hours: '8h 45m', status: 'Present', department: 'Finance' },
  { id: '4', employeeId: 'EMP004', employeeName: 'Alice Cooper', date: '2026-08-22', checkIn: '--:--', checkOut: '--:--', hours: '0h 0m', status: 'Leave', department: 'Marketing' },
  { id: '5', employeeId: 'EMP005', employeeName: 'Charlie Brown', date: '2026-08-22', checkIn: '--:--', checkOut: '--:--', hours: '0h 0m', status: 'Absent', department: 'IT' }
];

export const dummyLeaves = [
  { id: 'L001', employeeName: 'John Doe', leaveType: 'Casual Leave', startDate: '2026-08-25', endDate: '2026-08-26', days: 2, reason: 'Personal work', status: 'Pending' },
  { id: 'L002', employeeName: 'Jane Doe', leaveType: 'Sick Leave', startDate: '2026-08-20', endDate: '2026-08-21', days: 2, reason: 'Flu symptoms', status: 'Approved' },
  { id: 'L003', employeeName: 'Alice Cooper', leaveType: 'Maternity Leave', startDate: '2026-08-10', endDate: '2026-09-10', days: 30, reason: 'Childbirth', status: 'Approved' },
  { id: 'L004', employeeName: 'Charlie Brown', leaveType: 'Casual Leave', startDate: '2026-08-01', endDate: '2026-08-02', days: 2, reason: 'Family trip', status: 'Rejected', rejectionReason: 'Shortage of project staff' }
];

export const dummyPayroll = [
  { employeeId: 'EMP001', employeeName: 'John Doe', basicSalary: 40000, hra: 8000, allowances: 5000, deductions: 3000 },
  { employeeId: 'EMP002', employeeName: 'Jane Doe', basicSalary: 60000, hra: 12000, allowances: 8000, deductions: 5000 },
  { employeeId: 'EMP003', employeeName: 'Bob Smith', basicSalary: 50000, hra: 10000, allowances: 6000, deductions: 4000 },
  { employeeId: 'EMP004', employeeName: 'Alice Cooper', basicSalary: 45000, hra: 9000, allowances: 5000, deductions: 3000 },
  { employeeId: 'EMP005', employeeName: 'Charlie Brown', basicSalary: 35000, hra: 7000, allowances: 4000, deductions: 2500 }
];
