package com.dayflow.service;

import com.dayflow.dto.employee.EmployeeResponse;
import com.dayflow.dto.employee.EmployeeSummaryResponse;
import com.dayflow.dto.employee.UpdateProfileRequest;

import java.util.List;

public interface EmployeeService {
    EmployeeResponse getOwnProfile(Long userId);
    EmployeeResponse updateOwnProfile(Long userId, UpdateProfileRequest request);
    EmployeeResponse getEmployeeById(Long id);
    EmployeeResponse updateEmployee(Long id, UpdateProfileRequest request);
    List<EmployeeSummaryResponse> getAllEmployees();
}
