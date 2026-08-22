/** Module 7 — Employee Payroll Service */
import api from './api';

// Payroll Service for Employee Experience (Read-Only)
export const getMyPayroll = async () => {
  try {
    const response = await api.get('/payroll/me');
    return response.data;
  } catch (error) {
    console.warn('Backend API unavailable, using fallback data for getMyPayroll:', error.message);
    return null;
  }
};

export const getMyPayslips = getMyPayroll;

export const payrollService = {
  getMyPayroll,
  getMyPayslips,
};

export default payrollService;
