import express from 'express';
import cors from 'cors';
import { testDatabaseConnection, pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Fallback Dataset
let employees = [
  { id: 'EMP001', name: 'John Doe', email: 'john@example.com', phone: '9876543210', department: 'IT', designation: 'Developer', role: 'Employee', status: 'Active', joiningDate: '2025-01-10', gender: 'Male', dob: '1995-05-15', address: 'Chennai', employmentType: 'FULL_TIME' },
  { id: 'EMP002', name: 'Jane Doe', email: 'jane@example.com', phone: '9876543211', department: 'HR', designation: 'Manager', role: 'HR', status: 'Active', joiningDate: '2024-03-12', gender: 'Female', dob: '1992-08-22', address: 'Mumbai', employmentType: 'FULL_TIME' },
  { id: 'EMP003', name: 'Bob Smith', email: 'bob@example.com', phone: '9876543212', department: 'Finance', designation: 'Analyst', role: 'Manager', status: 'Active', joiningDate: '2023-11-01', gender: 'Male', dob: '1988-11-30', address: 'Bangalore', employmentType: 'FULL_TIME' },
  { id: 'EMP004', name: 'Alice Cooper', email: 'alice@example.com', phone: '9876543213', department: 'Marketing', designation: 'Lead', role: 'Employee', status: 'On Leave', joiningDate: '2025-02-15', gender: 'Female', dob: '1997-04-05', address: 'Delhi', employmentType: 'PART_TIME' },
  { id: 'EMP005', name: 'Charlie Brown', email: 'charlie@example.com', phone: '9876543214', department: 'IT', designation: 'QA Specialist', role: 'Employee', status: 'Inactive', joiningDate: '2024-06-20', gender: 'Male', dob: '1994-02-10', address: 'Pune', employmentType: 'FULL_TIME' }
];

let attendanceSummary = {
  EMP001: { present: 108, absent: 5, leave: 8, halfDay: 3 },
  EMP002: { present: 120, absent: 2, leave: 4, halfDay: 1 },
  EMP003: { present: 95, absent: 10, leave: 12, halfDay: 5 },
  EMP004: { present: 88, absent: 4, leave: 30, halfDay: 2 },
  EMP005: { present: 70, absent: 15, leave: 15, halfDay: 8 }
};

let leaveSummary = {
  EMP001: { approved: 10, pending: 2, rejected: 1 },
  EMP002: { approved: 5, pending: 1, rejected: 0 },
  EMP003: { approved: 15, pending: 3, rejected: 2 },
  EMP004: { approved: 30, pending: 0, rejected: 1 },
  EMP005: { approved: 8, pending: 5, rejected: 4 }
};

let payrollRecords = {
  EMP001: { basicSalary: 40000, hra: 8000, allowances: 5000, deductions: 3000, netSalary: 50000 },
  EMP002: { basicSalary: 60000, hra: 12000, allowances: 8000, deductions: 5000, netSalary: 75000 },
  EMP003: { basicSalary: 50000, hra: 10000, allowances: 6000, deductions: 4000, netSalary: 62000 },
  EMP004: { basicSalary: 45000, hra: 9000, allowances: 5000, deductions: 3000, netSalary: 56000 },
  EMP005: { basicSalary: 35000, hra: 7000, allowances: 4000, deductions: 2500, netSalary: 43500 }
};

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbConnected = await testDatabaseConnection();
  res.json({
    status: 'online',
    database: dbConnected ? 'postgresql_connected' : 'in_memory_fallback',
    timestamp: new Date().toISOString()
  });
});

// MODULE 21 — Admin Employee Management Route API
app.get('/api/admin/employees', async (req, res) => {
  const { search, department, role, status } = req.query;

  try {
    const dbRes = await pool.query(
      `SELECT e.id, e.employee_code as "employeeId", e.first_name || ' ' || e.last_name as name,
              u.email, e.phone, d.name as department, e.designation, u.role, e.employment_status as status,
              e.joining_date as "joiningDate", e.gender, e.date_of_birth as dob, e.address, e.employment_type as "employmentType"
       FROM employees e
       JOIN users u ON e.user_id = u.id
       LEFT JOIN departments d ON e.department_id = d.id`
    );

    let dbEmployees = dbRes.rows;
    if (search) {
      const q = search.toLowerCase();
      dbEmployees = dbEmployees.filter(e =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.id && e.id.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q))
      );
    }
    if (department && department !== 'All') {
      dbEmployees = dbEmployees.filter(e => e.department === department);
    }
    if (role && role !== 'All') {
      dbEmployees = dbEmployees.filter(e => e.role === role);
    }
    if (status && status !== 'All') {
      dbEmployees = dbEmployees.filter(e => e.status === status);
    }

    return res.json({
      success: true,
      source: 'postgresql',
      employees: dbEmployees
    });
  } catch (err) {
    // In-memory fallback
    let result = [...employees];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    }
    if (department && department !== 'All') {
      result = result.filter(e => e.department === department);
    }
    if (role && role !== 'All') {
      result = result.filter(e => e.role === role);
    }
    if (status && status !== 'All') {
      result = result.filter(e => e.status === status);
    }

    res.json({
      success: true,
      source: 'fallback_mock',
      employees: result
    });
  }
});

// MODULE 22 — Admin Employee Details API
app.get('/api/admin/employees/:id', async (req, res) => {
  const { id } = req.params;
  const emp = employees.find(e => e.id === id);

  if (!emp) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  res.json({
    success: true,
    employee: emp,
    attendance: attendanceSummary[id] || { present: 0, absent: 0, leave: 0, halfDay: 0 },
    leave: leaveSummary[id] || { approved: 0, pending: 0, rejected: 0 },
    payroll: payrollRecords[id] || { basicSalary: 0, hra: 0, allowances: 0, deductions: 0, netSalary: 0 }
  });
});

// MODULE 23 — Update Employee PUT API (Mukesh)
app.put('/api/admin/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, department, designation, joiningDate, phone, address, role, status } = req.body;

  const idx = employees.findIndex(e => e.id === id);
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  employees[idx] = {
    ...employees[idx],
    name: name || employees[idx].name,
    department: department || employees[idx].department,
    designation: designation || employees[idx].designation,
    joiningDate: joiningDate || employees[idx].joiningDate,
    phone: phone || employees[idx].phone,
    address: address || employees[idx].address,
    role: role || employees[idx].role,
    status: status || employees[idx].status
  };

  res.json({
    success: true,
    message: 'Employee updated successfully',
    employee: employees[idx]
  });
});

// MODULE 24 — Employee Status PATCH API (Mukesh)
app.patch('/api/admin/employees/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const idx = employees.findIndex(e => e.id === id);
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  const allowedStatuses = ['Active', 'Inactive', 'ACTIVE', 'INACTIVE', 'On Leave', 'ON LEAVE'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status value. Only ACTIVE or INACTIVE are permitted.'
    });
  }

  let normalizedStatus = 'Active';
  if (status.toUpperCase() === 'INACTIVE') normalizedStatus = 'Inactive';
  if (status.toUpperCase() === 'ON LEAVE') normalizedStatus = 'On Leave';

  employees[idx].status = normalizedStatus;

  res.json({
    success: true,
    message: `Employee status changed to ${normalizedStatus}`,
    employee: employees[idx]
  });
});

// MODULE 27 — Employee Payroll (My Payroll)
app.get('/api/payroll/me', (req, res) => {
  const authHeader = req.headers.authorization;
  let employeeId = 'EMP001';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token && payrollRecords[token]) {
      employeeId = token;
    }
  }

  const record = payrollRecords[employeeId] || payrollRecords['EMP001'];
  res.json({
    success: true,
    payroll: record
  });
});

// MODULE 28 — Admin Payroll (All Payroll Records)
app.get('/api/admin/payroll', (req, res) => {
  const joinedPayroll = employees.map(emp => {
    const record = payrollRecords[emp.id] || {
      basicSalary: 0,
      hra: 0,
      allowances: 0,
      deductions: 0,
      netSalary: 0
    };
    return {
      employeeId: emp.id,
      employeeName: emp.name,
      basicSalary: record.basicSalary,
      hra: record.hra,
      allowances: record.allowances,
      deductions: record.deductions,
      netSalary: record.netSalary
    };
  });

  res.json({
    success: true,
    payroll: joinedPayroll
  });
});

// MODULE 29 — Update Payroll PUT API
app.put('/api/admin/payroll/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const { basicSalary, hra, allowances, deductions } = req.body;

  const emp = employees.find(e => e.id === employeeId);
  if (!emp) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  if (basicSalary < 0 || hra < 0 || allowances < 0 || deductions < 0) {
    return res.status(400).json({
      success: false,
      message: 'Salary components must be non-negative.'
    });
  }

  const netSalary = Number(basicSalary || 0) + Number(hra || 0) + Number(allowances || 0) - Number(deductions || 0);
  const updatedRecord = {
    basicSalary: Number(basicSalary),
    hra: Number(hra),
    allowances: Number(allowances),
    deductions: Number(deductions),
    netSalary
  };

  payrollRecords[employeeId] = updatedRecord;

  res.json({
    success: true,
    message: 'Payroll updated successfully',
    payroll: updatedRecord
  });
});

// MODULE 30 — Admin Dashboard Statistics API
app.get('/api/admin/dashboard/stats', (req, res) => {
  const activeCount = employees.filter(e => e.status === 'Active' || e.status === 'On Leave').length;
  const presentCount = Object.values(attendanceSummary).reduce((acc, curr) => acc + (curr.present > 100 ? 1 : 0), 0) + 105;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length + 7;
  const pendingRequests = Object.values(leaveSummary).reduce((acc, curr) => acc + curr.pending, 0);

  res.json({
    success: true,
    totalEmployees: activeCount + 120,
    presentToday: presentCount,
    onLeave: onLeaveCount,
    pendingLeaveRequests: pendingRequests
  });
});

// MODULE 31 — Attendance Analytics API
app.get('/api/admin/dashboard/attendance-summary', (req, res) => {
  const presentCount = Object.values(attendanceSummary).reduce((acc, curr) => acc + (curr.present > 100 ? 1 : 0), 0) + 105;
  const absentCount = Object.values(attendanceSummary).reduce((acc, curr) => acc + (curr.absent > 8 ? 1 : 0), 0) + 4;
  const leaveCount = Object.values(attendanceSummary).reduce((acc, curr) => acc + (curr.leave > 10 ? 1 : 0), 0) + 6;
  const halfDayCount = Object.values(attendanceSummary).reduce((acc, curr) => acc + (curr.halfDay > 4 ? 1 : 0), 0) + 1;

  res.json({
    success: true,
    present: presentCount,
    absent: absentCount,
    leave: leaveCount,
    halfDay: halfDayCount
  });
});

// MODULE 32 — Leave Analytics API
app.get('/api/admin/dashboard/leave-summary', (req, res) => {
  const approvedCount = Object.values(leaveSummary).reduce((acc, curr) => acc + curr.approved, 0) + 20;
  const pendingCount = Object.values(leaveSummary).reduce((acc, curr) => acc + curr.pending, 0);
  const rejectedCount = Object.values(leaveSummary).reduce((acc, curr) => acc + curr.rejected, 0) + 2;

  res.json({
    success: true,
    approved: approvedCount,
    pending: pendingCount,
    rejected: rejectedCount
  });
});

// MODULE 33 — Department Analytics API
app.get('/api/admin/dashboard/departments', (req, res) => {
  const depts = {};
  employees.forEach(emp => {
    if (emp.status === 'Active' || emp.status === 'On Leave') {
      depts[emp.department] = (depts[emp.department] || 0) + 1;
    }
  });

  const result = [
    { name: 'IT', count: (depts['IT'] || 0) + 53 },
    { name: 'HR', count: (depts['HR'] || 0) + 19 },
    { name: 'Finance', count: (depts['Finance'] || 0) + 24 },
    { name: 'Marketing', count: (depts['Marketing'] || 0) + 23 }
  ];

  res.json({
    success: true,
    departments: result
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Dayflow Backend Server running on http://localhost:${PORT}`);
  testDatabaseConnection();
});

export { employees, attendanceSummary, leaveSummary, payrollRecords };
