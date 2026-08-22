package com.dayflow.mapper;

import com.dayflow.dto.leave.LeaveResponse;
import com.dayflow.entity.LeaveRequest;
import org.springframework.stereotype.Component;

@Component
public class LeaveMapper {

    public LeaveResponse toResponse(LeaveRequest leaveRequest) {
        if (leaveRequest == null) return null;
        String name = leaveRequest.getEmployee() != null ?
                leaveRequest.getEmployee().getFirstName() + " " + leaveRequest.getEmployee().getLastName() : "Unknown";
        return LeaveResponse.builder()
                .id(leaveRequest.getId())
                .employeeId(leaveRequest.getEmployee() != null ? leaveRequest.getEmployee().getId() : null)
                .employeeName(name)
                .leaveType(leaveRequest.getLeaveType())
                .startDate(leaveRequest.getStartDate())
                .endDate(leaveRequest.getEndDate())
                .totalDays(leaveRequest.getTotalDays())
                .reason(leaveRequest.getReason())
                .status(leaveRequest.getStatus())
                .adminComment(leaveRequest.getAdminComment())
                .createdAt(leaveRequest.getCreatedAt())
                .build();
    }
}
