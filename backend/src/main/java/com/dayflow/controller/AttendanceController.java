package com.dayflow.controller;

import com.dayflow.dto.attendance.AttendanceResponse;
import com.dayflow.dto.attendance.CheckInResponse;
import com.dayflow.dto.attendance.CheckOutResponse;
import com.dayflow.security.CustomUserDetails;
import com.dayflow.service.AttendanceService;
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
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance Management", description = "Endpoints for employee check-in, check-out, and attendance history")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    @Operation(summary = "Record employee daily check-in")
    public ResponseEntity<ApiResponse<CheckInResponse>> checkIn(@AuthenticationPrincipal CustomUserDetails userDetails) {
        CheckInResponse response = attendanceService.checkIn(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/check-out")
    @Operation(summary = "Record employee daily check-out and calculate working hours")
    public ResponseEntity<ApiResponse<CheckOutResponse>> checkOut(@AuthenticationPrincipal CustomUserDetails userDetails) {
        CheckOutResponse response = attendanceService.checkOut(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get employee's attendance history with optional filters (month, year, startDate, endDate)")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getMyAttendance(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<AttendanceResponse> history = attendanceService.getMyAttendanceHistoryFiltered(
                userDetails.getId(), month, year, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/my-history")
    @Operation(summary = "Get employee's personal attendance history (alias for /me)")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getMyAttendanceHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return getMyAttendance(userDetails, month, year, startDate, endDate);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Get company attendance by date (Admin/HR only)")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAttendanceByDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<AttendanceResponse> attendanceList = attendanceService.getAttendanceByDate(targetDate);
        return ResponseEntity.ok(ApiResponse.success(attendanceList));
    }
}
