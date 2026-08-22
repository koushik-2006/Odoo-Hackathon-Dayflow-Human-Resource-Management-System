package com.dayflow.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSummaryResponse {
    private Long id;
    private String employeeCode;
    private String name;
    private String department;
    private String designation;
    private String status;
}
