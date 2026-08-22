package com.dayflow.controller;

import com.dayflow.dto.leave.ApproveLeaveRequest;
import com.dayflow.dto.leave.LeaveRequestDto;
import com.dayflow.dto.leave.LeaveResponse;
import com.dayflow.dto.leave.RejectLeaveRequest;
import com.dayflow.security.CustomUserDetails;
import com.dayflow.service.LeaveService;
import com.dayflow.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
@Tag(name = "Leave Management", description = "Endpoints for employee leave application, history, and manager approvals")
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping({"", "/apply"})
    @Operation(summary = "Apply for leave (calculates number of days automatically)")
    public ResponseEntity<ApiResponse<LeaveResponse>> applyLeave(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody LeaveRequestDto requestDto
    ) {
        LeaveResponse response = leaveService.applyLeave(userDetails.getId(), requestDto);
        return new ResponseEntity<>(ApiResponse.success("Leave application submitted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping({"/my", "/my-requests"})
    @Operation(summary = "Get employee's personal leave history (Pending, Approved, Rejected)")
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getMyLeaveRequests(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<LeaveResponse> requests = leaveService.getMyLeaveRequests(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Get all company leave requests (Admin/HR only)")
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getAllLeaveRequests() {
        List<LeaveResponse> requests = leaveService.getAllLeaveRequests();
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
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

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
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
