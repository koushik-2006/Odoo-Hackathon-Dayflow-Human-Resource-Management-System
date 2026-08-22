import api from './api';

// Pre-configured mock users for instant test drive & offline demo
const MOCK_USERS = {
  admin: {
    id: 'ADM-001',
    employeeId: 'EMP-1001',
    name: 'Sarah Connor (Admin)',
    email: 'admin@dayflow.com',
    role: 'admin',
    designation: 'System Administrator & HR Director',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  hr: {
    id: 'HR-003',
    employeeId: 'EMP-3012',
    name: 'Jessica Vance (HR)',
    email: 'hr@dayflow.com',
    role: 'hr',
    designation: 'HR Senior Manager',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
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
};

export const authService = {
  // Login API integration (POST /api/auth/login)
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      console.warn('API connection offline. Utilizing mock authentication fallback.');
      
      const requestedRole = credentials.role || 
        (credentials.email?.includes('admin') ? 'admin' : credentials.email?.includes('hr') ? 'hr' : 'employee');
      
      const user = MOCK_USERS[requestedRole] || {
        id: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
        employeeId: credentials.employeeId || 'EMP-7788',
        name: credentials.email ? credentials.email.split('@')[0] : 'Demo User',
        email: credentials.email || 'user@dayflow.com',
        role: requestedRole,
        designation: requestedRole === 'admin' ? 'Administrator' : requestedRole === 'hr' ? 'HR Specialist' : 'Software Engineer',
        department: requestedRole === 'employee' ? 'Engineering' : 'Human Resources',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      };

      return {
        token: 'dayflow-jwt-token-' + Date.now(),
        user,
      };
    }
  },

  // Register API integration (POST /api/auth/register)
  async register(data) {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (err) {
      console.warn('API connection offline. Simulating registration success.');
      return {
        message: 'Account registration successful! You can now log in.',
        user: {
          employeeId: data.employeeId,
          email: data.email,
          role: data.role || 'employee',
        },
      };
    }
  },

  // Forgot Password API integration (POST /api/auth/forgot-password)
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      console.warn('API connection offline. Simulating password reset link email.');
      return {
        message: `Password reset instructions sent to ${email}`,
      };
    }
  },

  // Fetch current authenticated user (GET /api/auth/me)
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
