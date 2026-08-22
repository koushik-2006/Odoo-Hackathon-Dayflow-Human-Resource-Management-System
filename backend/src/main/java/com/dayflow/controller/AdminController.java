package com.dayflow.controller;

import com.dayflow.dto.attendance.AttendanceResponse;
import com.dayflow.dto.dashboard.DashboardStatsResponse;
import com.dayflow.enums.AttendanceStatus;
import com.dayflow.service.AttendanceService;
import com.dayflow.service.DashboardService;
import com.dayflow.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'HR')")
@RequiredArgsConstructor
@Tag(name = "Admin Operations", description = "Endpoints restricted exclusively to Administrators and HR Managers")
public class AdminController {

    private final DashboardService dashboardService;
    private final AttendanceService attendanceService;

    @GetMapping("/overview")
    @Operation(summary = "Get admin control center overview statistics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getAdminOverview() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/attendance")
    @Operation(summary = "Get all employee attendance with filters (employee, date, department, status)")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAdminAttendance(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) String employee,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) AttendanceStatus status
    ) {
        List<AttendanceResponse> attendanceList = attendanceService.getAdminAttendance(
                employeeId, employee, date, department, status);
        return ResponseEntity.ok(ApiResponse.success(attendanceList));
    }
}
