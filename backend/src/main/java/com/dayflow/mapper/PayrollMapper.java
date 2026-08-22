package com.dayflow.mapper;

import com.dayflow.dto.payroll.PayrollResponse;
import com.dayflow.entity.Payroll;
import org.springframework.stereotype.Component;

@Component
public class PayrollMapper {

    public PayrollResponse toResponse(Payroll payroll) {
        if (payroll == null) return null;
        String name = payroll.getEmployee() != null ?
                payroll.getEmployee().getFirstName() + " " + payroll.getEmployee().getLastName() : "Unknown";
        String code = payroll.getEmployee() != null ? payroll.getEmployee().getEmployeeCode() : "";
        return PayrollResponse.builder()
                .id(payroll.getId())
                .employeeId(payroll.getEmployee() != null ? payroll.getEmployee().getId() : null)
                .employeeName(name)
                .employeeCode(code)
                .month(payroll.getMonth())
                .year(payroll.getYear())
                .basicSalary(payroll.getBasicSalary())
                .allowances(payroll.getAllowances())
                .deductions(payroll.getDeductions())
                .netSalary(payroll.getNetSalary())
                .status(payroll.getStatus())
                .paymentDate(payroll.getPaymentDate())
                .build();
    }
}
