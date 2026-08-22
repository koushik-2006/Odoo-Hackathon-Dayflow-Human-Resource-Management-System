package com.dayflow.dto.payroll;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePayrollRequest {

    @NotNull(message = "Basic salary is required")
    private BigDecimal basicSalary;

    private BigDecimal allowances;
    private BigDecimal deductions;
    private String status;
}
