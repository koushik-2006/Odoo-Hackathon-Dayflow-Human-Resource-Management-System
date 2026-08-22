package com.dayflow.mapper;

import com.dayflow.dto.attendance.AttendanceResponse;
import com.dayflow.entity.Attendance;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    public AttendanceResponse toResponse(Attendance attendance) {
        if (attendance == null) return null;
        String name = attendance.getEmployee() != null ?
                attendance.getEmployee().getFirstName() + " " + attendance.getEmployee().getLastName() : "Unknown";
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .employeeId(attendance.getEmployee() != null ? attendance.getEmployee().getId() : null)
                .employeeName(name)
                .date(attendance.getDate())
                .checkIn(attendance.getCheckIn())
                .checkOut(attendance.getCheckOut())
                .workHours(attendance.getWorkHours())
                .status(attendance.getStatus())
                .build();
    }
}
