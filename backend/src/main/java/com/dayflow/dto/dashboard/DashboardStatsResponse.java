package com.dayflow.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalEmployees;
    private long presentToday;
    private long onLeaveToday;
    private long pendingLeaveRequests;
    private double attendanceRate;
}
