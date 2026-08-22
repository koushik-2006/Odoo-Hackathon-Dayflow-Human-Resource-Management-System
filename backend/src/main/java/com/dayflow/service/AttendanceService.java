package com.dayflow.service;

import com.dayflow.dto.attendance.AttendanceResponse;
import com.dayflow.dto.attendance.CheckInResponse;
import com.dayflow.dto.attendance.CheckOutResponse;
import com.dayflow.enums.AttendanceStatus;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    CheckInResponse checkIn(Long userId);
    CheckOutResponse checkOut(Long userId);
    List<AttendanceResponse> getMyAttendanceHistory(Long userId);
    List<AttendanceResponse> getMyAttendanceHistoryFiltered(Long userId, Integer month, Integer year, LocalDate startDate, LocalDate endDate);
    List<AttendanceResponse> getAttendanceByDate(LocalDate date);
    List<AttendanceResponse> getAdminAttendance(Long employeeId, String employee, LocalDate date, String department, AttendanceStatus status);
}
