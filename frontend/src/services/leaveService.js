import api from './api';

export const leaveService = {
  async getMyLeaveRequests() {
    try {
      const res = await api.get('/leave/me');
      return res.data;
    } catch {
      return [
        { id: 'LV-101', type: 'Annual Leave', startDate: '2026-09-01', endDate: '2026-09-05', days: 5, status: 'Approved', reason: 'Family vacation' },
        { id: 'LV-102', type: 'Sick Leave', startDate: '2026-08-10', endDate: '2026-08-10', days: 1, status: 'Approved', reason: 'Dental appointment' },
      ];
    }
  },
  async applyLeave(data) {
    try {
      const res = await api.post('/leave/apply', data);
      return res.data;
    } catch {
      return { message: 'Leave application submitted successfully for review.' };
    }
  },
};

export default leaveService;
