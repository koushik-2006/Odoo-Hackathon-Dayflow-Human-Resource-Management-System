package com.dayflow.service.impl;

import com.dayflow.dto.attendance.AttendanceResponse;
import com.dayflow.dto.attendance.CheckInResponse;
import com.dayflow.dto.attendance.CheckOutResponse;
import com.dayflow.entity.Attendance;
import com.dayflow.entity.Employee;
import com.dayflow.enums.AttendanceStatus;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.mapper.AttendanceMapper;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceMapper attendanceMapper;

    @Override
    @Transactional
    public CheckInResponse checkIn(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user ID: " + userId));

        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeAndAttendanceDate(employee, today);
        if (existing.isPresent()) {
            throw new BadRequestException("Employee already checked in for today (" + today + ")");
        }

        LocalDateTime now = LocalDateTime.now();
        Attendance attendance = Attendance.builder()
                .employee(employee)
                .attendanceDate(today)
                .checkIn(now)
                .status(AttendanceStatus.PRESENT)
                .build();

        Attendance saved = attendanceRepository.save(attendance);

        return CheckInResponse.builder()
                .id(saved.getId())
                .checkInTime(saved.getCheckIn())
                .status(saved.getStatus().name())
                .message("Checked in successfully at " + now.toLocalTime())
                .build();
    }

    @Override
    @Transactional
    public CheckOutResponse checkOut(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user ID: " + userId));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeAndAttendanceDate(employee, today)
                .orElseThrow(() -> new BadRequestException("No active check-in record found for today. Please check in first."));

        if (attendance.getCheckOut() != null) {
            throw new BadRequestException("Employee already checked out for today.");
        }

        LocalDateTime now = LocalDateTime.now();
        attendance.setCheckOut(now);

        long minutes = Duration.between(attendance.getCheckIn(), now).toMinutes();
        double hours = Math.round((minutes / 60.0) * 100.0) / 100.0;
        attendance.setWorkingHours(hours);

        Attendance saved = attendanceRepository.save(attendance);

        return CheckOutResponse.builder()
                .id(saved.getId())
                .checkOutTime(saved.getCheckOut())
                .totalHours(hours)
                .status(saved.getStatus().name())
                .message("Checked out successfully. Total working hours: " + hours + " hrs")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getMyAttendanceHistory(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user ID: " + userId));
        return attendanceRepository.findByEmployeeOrderByAttendanceDateDesc(employee).stream()
                .map(attendanceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByAttendanceDate(date).stream()
                .map(attendanceMapper::toResponse)
                .collect(Collectors.toList());
    }
}
