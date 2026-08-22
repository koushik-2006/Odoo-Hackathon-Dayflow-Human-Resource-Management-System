package com.dayflow.service;

import com.dayflow.dto.leave.ApproveLeaveRequest;
import com.dayflow.dto.leave.LeaveRequestDto;
import com.dayflow.dto.leave.LeaveResponse;
import com.dayflow.dto.leave.RejectLeaveRequest;

import java.util.List;

public interface LeaveService {
    LeaveResponse applyLeave(Long userId, LeaveRequestDto requestDto);
    List<LeaveResponse> getMyLeaveRequests(Long userId);
    List<LeaveResponse> getAllLeaveRequests();
    LeaveResponse approveLeave(Long leaveId, ApproveLeaveRequest approveRequest);
    LeaveResponse rejectLeave(Long leaveId, RejectLeaveRequest rejectRequest);
}
