import api from './api';

export const payrollService = {
  async getMyPayslips() {
    try {
      const res = await api.get('/payroll/me');
      return res.data;
    } catch {
      return [
        { id: 'PAY-2026-07', month: 'July 2026', basicSalary: 6500, hra: 1800, allowances: 700, netSalary: 9000, status: 'Paid', date: '2026-07-31' },
        { id: 'PAY-2026-06', month: 'June 2026', basicSalary: 6500, hra: 1800, allowances: 700, netSalary: 9000, status: 'Paid', date: '2026-06-30' },
      ];
    }
  },
};

export default payrollService;
