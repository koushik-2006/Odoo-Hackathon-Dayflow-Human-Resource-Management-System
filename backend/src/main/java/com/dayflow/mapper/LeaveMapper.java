package com.dayflow.mapper;

import com.dayflow.dto.leave.LeaveResponse;
import com.dayflow.entity.LeaveRequest;
import org.springframework.stereotype.Component;

@Component
public class LeaveMapper {

    public LeaveResponse toResponse(LeaveRequest leaveRequest) {
        if (leaveRequest == null) return null;
        
        String name = "Unknown";
        String code = null;
        Long empId = null;

        if (leaveRequest.getEmployee() != null) {
            empId = leaveRequest.getEmployee().getId();
            name = leaveRequest.getEmployee().getFirstName() + " " + leaveRequest.getEmployee().getLastName();
            code = leaveRequest.getEmployee().getEmployeeCode();
        }

        return LeaveResponse.builder()
                .id(leaveRequest.getId())
                .employeeId(empId)
                .employeeCode(code)
                .employeeName(name)
                .leaveType(leaveRequest.getLeaveType())
                .startDate(leaveRequest.getStartDate())
                .endDate(leaveRequest.getEndDate())
                .numberOfDays(leaveRequest.getNumberOfDays())
                .totalDays(leaveRequest.getNumberOfDays())
                .reason(leaveRequest.getReason())
                .status(leaveRequest.getStatus())
                .adminComment(leaveRequest.getAdminComment())
                .approvedBy(leaveRequest.getApprovedBy())
                .createdAt(leaveRequest.getCreatedAt())
                .updatedAt(leaveRequest.getUpdatedAt())
                .build();
    }
}
