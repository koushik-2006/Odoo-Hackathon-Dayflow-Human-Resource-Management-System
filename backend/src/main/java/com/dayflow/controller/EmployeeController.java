package com.dayflow.controller;

import com.dayflow.dto.employee.EmployeeResponse;
import com.dayflow.dto.employee.EmployeeSummaryResponse;
import com.dayflow.dto.employee.UpdateProfileRequest;
import com.dayflow.security.CustomUserDetails;
import com.dayflow.service.EmployeeService;
import com.dayflow.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employee Profile Management", description = "Endpoints for viewing and updating employee profiles")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/me")
    @Operation(summary = "Get own employee profile")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getOwnProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        EmployeeResponse profile = employeeService.getOwnProfile(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/me")
    @Operation(summary = "Update own employee profile (Phone, Address, Profile Picture)")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateOwnProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateProfileRequest request
    ) {
        EmployeeResponse updated = employeeService.updateOwnProfile(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Get all employees directory (Admin/HR only)")
    public ResponseEntity<ApiResponse<List<EmployeeSummaryResponse>>> getAllEmployees() {
        List<EmployeeSummaryResponse> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(ApiResponse.success(employees));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Get specific employee by ID (Admin/HR only)")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.success(employee));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Update employee by ID (Admin/HR only)")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request
    ) {
        EmployeeResponse updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", updated));
    }
}
