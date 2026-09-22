import api from './api';

let localProfileState = {
  id: 'EMP-2045',
  employeeId: 'EMP-2045',
  name: 'Alex Mercer',
  email: 'alex.mercer@dayflow.com',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace, Springfield, OR 97477',
  dob: '1994-06-15',
  designation: 'Senior Frontend Engineer',
  department: 'Engineering & Tech',
  joiningDate: '2022-03-01',
  employmentType: 'Full-Time Permanent',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  basicSalary: 6500,
  hra: 1800,
  allowances: 700,
  netSalary: 9000,
};

export const employeeService = {
  // GET /api/employees/me
  async getProfile() {
    try {
      const response = await api.get('/employees/me');
      return response.data;
    } catch (err) {
      console.warn('API /employees/me unreachable. Using current profile state.');
      return localProfileState;
    }
  },

  // PUT /api/employees/me
  async updateProfile(data) {
    try {
      const response = await api.put('/employees/me', data);
      return response.data;
    } catch (err) {
      console.warn('API PUT /employees/me unreachable. Updating local mock state.');
      localProfileState = {
        ...localProfileState,
        ...data,
      };
      return {
        message: 'Profile updated successfully!',
        profile: localProfileState,
      };
    }
  },

  // Admin APIs placeholders
  async getAllEmployees() {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (err) {
      return [
        localProfileState,
        {
          id: 'EMP-1001',
          employeeId: 'EMP-1001',
          name: 'Sarah Connor',
          email: 'sarah@dayflow.com',
          phone: '+1 (555) 987-6543',
          address: '101 Cyberdyne Way, Los Angeles, CA',
          dob: '1985-05-12',
          designation: 'HR Director',
          department: 'Human Resources',
          joiningDate: '2020-01-15',
          employmentType: 'Full-Time',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
          basicSalary: 8500,
          hra: 2200,
          allowances: 1000,
          netSalary: 11700,
        },
      ];
    }
  },
};

export default employeeService;
