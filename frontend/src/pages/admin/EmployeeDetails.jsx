import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Building, Calendar, DollarSign, ShieldCheck } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function EmployeeDetails() {
  const { id } = useParams();

  const mockDetails = {
    id: id || 'EMP-2045',
    name: 'Alex Mercer',
    email: 'alex.mercer@dayflow.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield, OR',
    dob: '1994-06-15',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    joiningDate: '2022-03-01',
    employmentType: 'Full-Time Permanent',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    basicSalary: 6500,
    hra: 1800,
    allowances: 700,
    netSalary: 9000,
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <NavLink
        to="/admin/employees"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Employee Directory
      </NavLink>

      <Card glass className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={mockDetails.avatar}
            alt={mockDetails.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/40"
          />
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-black text-slate-100">{mockDetails.name}</h2>
              <Badge variant="indigo" size="sm" dot>Active</Badge>
            </div>
            <p className="text-sm text-indigo-300 font-medium">
              {mockDetails.designation} &bull; {mockDetails.department}
            </p>
            <p className="text-xs font-mono text-slate-400">ID: {mockDetails.id}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-300">
            <p><strong>Email:</strong> {mockDetails.email}</p>
            <p><strong>Phone:</strong> {mockDetails.phone}</p>
            <p><strong>Address:</strong> {mockDetails.address}</p>
            <p><strong>Date of Birth:</strong> {formatDate(mockDetails.dob)}</p>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle>Compensation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-300">
            <p><strong>Basic Salary:</strong> {formatCurrency(mockDetails.basicSalary)}</p>
            <p><strong>HRA:</strong> {formatCurrency(mockDetails.hra)}</p>
            <p><strong>Allowances:</strong> {formatCurrency(mockDetails.allowances)}</p>
            <p className="text-sm font-bold text-emerald-400"><strong>Net Salary:</strong> {formatCurrency(mockDetails.netSalary)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
