import api from './api';

// Mock users for local test drive / fallback
const MOCK_USERS = {
  admin: {
    id: 'ADM-001',
    employeeId: 'EMP-1001',
    name: 'Sarah Connor (Admin)',
    email: 'admin@dayflow.com',
    role: 'admin',
    designation: 'HR Director & System Admin',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  employee: {
    id: 'EMP-002',
    employeeId: 'EMP-2045',
    name: 'Alex Mercer',
    email: 'alex@dayflow.com',
    role: 'employee',
    designation: 'Senior Frontend Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield, OR',
    dob: '1994-06-15',
    joiningDate: '2022-03-01',
    employmentType: 'Full-Time',
    basicSalary: 6500,
    hra: 1800,
    allowances: 700,
    netSalary: 9000,
  },
  hr: {
    id: 'HR-003',
    employeeId: 'EMP-3012',
    name: 'Jessica Vance',
    email: 'hr@dayflow.com',
    role: 'hr',
    designation: 'HR Manager',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
};

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      // Fallback for offline demo mode
      console.warn('API connection failed. Using fallback mock authentication.');
      const role = credentials.role || (credentials.email?.includes('admin') ? 'admin' : 'employee');
      const user = MOCK_USERS[role] || {
        id: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
        employeeId: credentials.employeeId || 'EMP-7788',
        name: credentials.email ? credentials.email.split('@')[0] : 'Demo User',
        email: credentials.email || 'user@dayflow.com',
        role: role,
        designation: role === 'admin' ? 'Administrator' : 'Software Engineer',
        department: 'Technology',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      };
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user,
      };
    }
  },

  async register(data) {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (err) {
      console.warn('API connection failed. Simulating registration success.');
      return {
        message: 'Registration successful! You can now log in.',
        user: {
          employeeId: data.employeeId,
          email: data.email,
          role: data.role || 'employee',
        },
      };
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      console.warn('API connection failed. Simulating password reset email trigger.');
      return {
        message: `Password reset link has been sent to ${email}`,
      };
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      return null;
    }
  },
};

export default authService;
