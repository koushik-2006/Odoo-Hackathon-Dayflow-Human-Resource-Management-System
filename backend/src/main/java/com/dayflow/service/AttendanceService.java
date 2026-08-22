package com.dayflow.service;

import com.dayflow.dto.attendance.AttendanceResponse;
import com.dayflow.dto.attendance.CheckInResponse;
import com.dayflow.dto.attendance.CheckOutResponse;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    CheckInResponse checkIn(Long userId);
    CheckOutResponse checkOut(Long userId);
    List<AttendanceResponse> getMyAttendanceHistory(Long userId);
    List<AttendanceResponse> getAttendanceByDate(LocalDate date);
}
