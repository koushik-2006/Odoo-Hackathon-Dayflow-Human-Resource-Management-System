package com.dayflow.mapper;

import com.dayflow.dto.employee.EmployeeResponse;
import com.dayflow.dto.employee.EmployeeSummaryResponse;
import com.dayflow.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeResponse toResponse(Employee employee) {
        if (employee == null) return null;
        return EmployeeResponse.builder()
                .id(employee.getId())
                .userId(employee.getUser() != null ? employee.getUser().getId() : null)
                .employeeCode(employee.getEmployeeCode())
                .email(employee.getUser() != null ? employee.getUser().getEmail() : null)
                .role(employee.getUser() != null ? employee.getUser().getRole() : null)
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .phone(employee.getPhone())
                .address(employee.getAddress())
                .dateOfBirth(employee.getDateOfBirth())
                .gender(employee.getGender())
                .department(employee.getDepartment())
                .designation(employee.getDesignation())
                .joiningDate(employee.getJoiningDate())
                .employmentType(employee.getEmploymentType())
                .status(employee.getStatus())
                .profileImage(employee.getProfileImage())
                .build();
    }

    public EmployeeSummaryResponse toSummaryResponse(Employee employee) {
        if (employee == null) return null;
        return EmployeeSummaryResponse.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .name(employee.getFirstName() + " " + employee.getLastName())
                .department(employee.getDepartment())
                .designation(employee.getDesignation())
                .status(employee.getStatus() != null ? employee.getStatus().name() : "ACTIVE")
                .build();
    }
}
