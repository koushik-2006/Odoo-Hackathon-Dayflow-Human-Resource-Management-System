package com.dayflow.service.impl;

import com.dayflow.dto.dashboard.DashboardStatsResponse;
import com.dayflow.enums.AttendanceStatus;
import com.dayflow.enums.LeaveStatus;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.LeaveRequestRepository;
import com.dayflow.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalEmployees = employeeRepository.count();
        LocalDate today = LocalDate.now();
        long presentToday = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.PRESENT);
        long onLeaveToday = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.ON_LEAVE);
        long pendingLeaveRequests = leaveRequestRepository.countByStatus(LeaveStatus.PENDING);

        double rate = totalEmployees > 0 ? (presentToday * 100.0) / totalEmployees : 0.0;
        double roundedRate = Math.round(rate * 10.0) / 10.0;

        return DashboardStatsResponse.builder()
                .totalEmployees(totalEmployees)
                .presentToday(presentToday)
                .onLeaveToday(onLeaveToday)
                .pendingLeaveRequests(pendingLeaveRequests)
                .attendanceRate(roundedRate)
                .build();
    }
}
