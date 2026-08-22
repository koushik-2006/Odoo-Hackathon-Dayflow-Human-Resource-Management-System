package com.dayflow.controller;

import com.dayflow.dto.attendance.AttendanceResponse;
import com.dayflow.dto.dashboard.DashboardStatsResponse;
import com.dayflow.dto.leave.ApproveLeaveRequest;
import com.dayflow.dto.leave.LeaveResponse;
import com.dayflow.dto.leave.RejectLeaveRequest;
import com.dayflow.enums.AttendanceStatus;
import com.dayflow.security.CustomUserDetails;
import com.dayflow.service.AttendanceService;
import com.dayflow.service.DashboardService;
import com.dayflow.service.LeaveService;
import com.dayflow.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    private final LeaveService leaveService;

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

    @GetMapping("/leaves")
    @Operation(summary = "Get all company leave requests (Admin/HR only)")
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getAdminLeaveRequests() {
        List<LeaveResponse> requests = leaveService.getAllLeaveRequests();
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @PutMapping("/leaves/{id}/approve")
    @Operation(summary = "Approve leave request (Admin/HR only, auto-creates Attendance records)")
    public ResponseEntity<ApiResponse<LeaveResponse>> approveLeave(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody(required = false) ApproveLeaveRequest approveRequest
    ) {
        String approver = userDetails != null ? userDetails.getUsername() : "ADMIN";
        LeaveResponse response = leaveService.approveLeave(id, approveRequest, approver);
        return ResponseEntity.ok(ApiResponse.success("Leave request approved successfully", response));
    }

    @PutMapping("/leaves/{id}/reject")
    @Operation(summary = "Reject leave request (Admin/HR only)")
    public ResponseEntity<ApiResponse<LeaveResponse>> rejectLeave(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody(required = false) RejectLeaveRequest rejectRequest
    ) {
        String approver = userDetails != null ? userDetails.getUsername() : "ADMIN";
        LeaveResponse response = leaveService.rejectLeave(id, rejectRequest, approver);
        return ResponseEntity.ok(ApiResponse.success("Leave request rejected successfully", response));
    }
}
