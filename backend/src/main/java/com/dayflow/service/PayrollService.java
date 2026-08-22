package com.dayflow.service;

import com.dayflow.dto.payroll.PayrollResponse;
import com.dayflow.dto.payroll.UpdatePayrollRequest;

import java.util.List;

public interface PayrollService {
    List<PayrollResponse> getMyPayslips(Long userId);
    List<PayrollResponse> getAllPayrolls();
    PayrollResponse getPayrollByEmployeeAndPeriod(Long employeeId, String month, Integer year);
    PayrollResponse updatePayroll(Long payrollId, UpdatePayrollRequest request);
}
