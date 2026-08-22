import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Search, Plus, Filter, Eye, Mail, Building, IdCard } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-2045',
    name: 'Alex Mercer',
    email: 'alex.mercer@dayflow.com',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    role: 'employee',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'EMP-1001',
    name: 'Sarah Connor',
    email: 'sarah@dayflow.com',
    department: 'Human Resources',
    designation: 'HR Director',
    role: 'admin',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'EMP-3012',
    name: 'Jessica Vance',
    email: 'hr@dayflow.com',
    department: 'Human Resources',
    designation: 'HR Manager',
    role: 'hr',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    id: 'EMP-4050',
    name: 'Michael Scott',
    email: 'michael@dayflow.com',
    department: 'Sales',
    designation: 'Regional Sales Manager',
    role: 'employee',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
];

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const filtered = INITIAL_EMPLOYEES.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Employee Directory</h1>
          <p className="text-xs text-slate-400">View and manage all staff members across the company</p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <Card glass className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by name, email, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Employees Table */}
      <Card glass>
        <CardContent className="p-0 sm:p-6">
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Employee</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-9 h-9 rounded-full object-cover border border-indigo-500/40"
                      />
                      <div>
                        <p className="font-bold text-slate-200">{emp.name}</p>
                        <p className="text-[11px] text-slate-400">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-indigo-400 font-bold">{emp.id}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell className="text-xs text-slate-300">{emp.designation}</TableCell>
                  <TableCell>
                    <Badge variant={emp.role === 'admin' ? 'purple' : 'neutral'} size="sm">
                      {emp.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" size="sm" dot>
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <NavLink to={`/admin/employee/${emp.id}`}>
                      <Button variant="outline" size="sm" icon={Eye}>
                        Details
                      </Button>
                    </NavLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
