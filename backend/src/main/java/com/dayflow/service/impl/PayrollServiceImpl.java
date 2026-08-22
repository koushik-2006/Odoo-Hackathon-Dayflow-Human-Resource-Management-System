package com.dayflow.service.impl;

import com.dayflow.dto.payroll.PayrollResponse;
import com.dayflow.dto.payroll.UpdatePayrollRequest;
import com.dayflow.entity.Employee;
import com.dayflow.entity.Payroll;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.mapper.PayrollMapper;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.PayrollRepository;
import com.dayflow.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final PayrollMapper payrollMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponse> getMyPayslips(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
        return payrollRepository.findByEmployeeOrderByYearDescMonthDesc(employee).stream()
                .map(payrollMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponse> getAllPayrolls() {
        return payrollRepository.findAll().stream()
                .map(payrollMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PayrollResponse getPayrollByEmployeeAndPeriod(Long employeeId, String month, Integer year) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));
        Payroll payroll = payrollRepository.findByEmployeeAndMonthAndYear(employee, month, year)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not found for " + month + " " + year));
        return payrollMapper.toResponse(payroll);
    }

    @Override
    @Transactional
    public PayrollResponse updatePayroll(Long payrollId, UpdatePayrollRequest request) {
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not found with ID: " + payrollId));

        if (request.getBasicSalary() != null) payroll.setBasicSalary(request.getBasicSalary());
        if (request.getAllowances() != null) payroll.setAllowances(request.getAllowances());
        if (request.getDeductions() != null) payroll.setDeductions(request.getDeductions());
        if (request.getStatus() != null) payroll.setStatus(request.getStatus());

        BigDecimal basic = payroll.getBasicSalary() != null ? payroll.getBasicSalary() : BigDecimal.ZERO;
        BigDecimal allowances = payroll.getAllowances() != null ? payroll.getAllowances() : BigDecimal.ZERO;
        BigDecimal deductions = payroll.getDeductions() != null ? payroll.getDeductions() : BigDecimal.ZERO;

        payroll.setNetSalary(basic.add(allowances).subtract(deductions));

        Payroll updated = payrollRepository.save(payroll);
        return payrollMapper.toResponse(updated);
    }
}
