package com.dayflow.mapper;

import com.dayflow.dto.attendance.AttendanceResponse;
import com.dayflow.entity.Attendance;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class AttendanceMapper {

    public AttendanceResponse toResponse(Attendance attendance) {
        if (attendance == null) return null;
        
        String name = "Unknown";
        String code = null;
        String dept = null;
        Long empId = null;
        
        if (attendance.getEmployee() != null) {
            empId = attendance.getEmployee().getId();
            name = attendance.getEmployee().getFirstName() + " " + attendance.getEmployee().getLastName();
            code = attendance.getEmployee().getEmployeeCode();
            dept = attendance.getEmployee().getDepartment();
        }

        String formattedHours = null;
        if (attendance.getCheckIn() != null && attendance.getCheckOut() != null) {
            long totalMinutes = Duration.between(attendance.getCheckIn(), attendance.getCheckOut()).toMinutes();
            long hrs = totalMinutes / 60;
            long mins = totalMinutes % 60;
            formattedHours = hrs + "h " + mins + "m";
        }

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .employeeId(empId)
                .employeeCode(code)
                .employeeName(name)
                .department(dept)
                .attendanceDate(attendance.getAttendanceDate())
                .date(attendance.getAttendanceDate())
                .checkIn(attendance.getCheckIn())
                .checkOut(attendance.getCheckOut())
                .workingHours(attendance.getWorkingHours())
                .workHours(attendance.getWorkingHours())
                .formattedWorkingHours(formattedHours)
                .status(attendance.getStatus())
                .remarks(attendance.getRemarks())
                .build();
    }
}
