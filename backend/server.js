import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database / Employee Entity Records
let employees = [
  { id: 'EMP001', name: 'John Doe', email: 'john@example.com', phone: '9876543210', department: 'IT', designation: 'Developer', role: 'Employee', status: 'Active', joiningDate: '2025-01-10', gender: 'Male', dob: '1995-05-15', address: 'Chennai', employmentType: 'FULL_TIME' },
  { id: 'EMP002', name: 'Jane Doe', email: 'jane@example.com', phone: '9876543211', department: 'HR', designation: 'Manager', role: 'HR', status: 'Active', joiningDate: '2024-03-12', gender: 'Female', dob: '1992-08-22', address: 'Mumbai', employmentType: 'FULL_TIME' },
  { id: 'EMP003', name: 'Bob Smith', email: 'bob@example.com', phone: '9876543212', department: 'Finance', designation: 'Analyst', role: 'Manager', status: 'Active', joiningDate: '2023-11-01', gender: 'Male', dob: '1988-11-30', address: 'Bangalore', employmentType: 'FULL_TIME' },
  { id: 'EMP004', name: 'Alice Cooper', email: 'alice@example.com', phone: '9876543213', department: 'Marketing', designation: 'Lead', role: 'Employee', status: 'On Leave', joiningDate: '2025-02-15', gender: 'Female', dob: '1997-04-05', address: 'Delhi', employmentType: 'PART_TIME' },
  { id: 'EMP005', name: 'Charlie Brown', email: 'charlie@example.com', phone: '9876543214', department: 'IT', designation: 'QA Specialist', role: 'Employee', status: 'Inactive', joiningDate: '2024-06-20', gender: 'Male', dob: '1994-02-10', address: 'Pune', employmentType: 'FULL_TIME' }
];

// MODULE 21 — Admin Employee Management Route API
app.get('/api/admin/employees', (req, res) => {
  const { search, department, role, status } = req.query;
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
    employees: result
  });
});

app.listen(PORT, () => {
  console.log(`Consolidated Backend Server running on http://localhost:${PORT}`);
});
export { employees };
