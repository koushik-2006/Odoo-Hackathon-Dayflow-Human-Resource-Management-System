package com.dayflow.service.impl;

import com.dayflow.dto.leave.ApproveLeaveRequest;
import com.dayflow.dto.leave.LeaveRequestDto;
import com.dayflow.dto.leave.LeaveResponse;
import com.dayflow.dto.leave.RejectLeaveRequest;
import com.dayflow.entity.Employee;
import com.dayflow.entity.LeaveRequest;
import com.dayflow.enums.LeaveStatus;
import com.dayflow.enums.LeaveType;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.mapper.LeaveMapper;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.LeaveRequestRepository;
import com.dayflow.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveMapper leaveMapper;

    @Override
    @Transactional
    public LeaveResponse applyLeave(Long userId, LeaveRequestDto requestDto) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user ID: " + userId));

        if (requestDto.getEndDate().isBefore(requestDto.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        // Map shorthand leave types (PAID -> PAID_LEAVE, SICK -> SICK_LEAVE, UNPAID -> UNPAID_LEAVE)
        LeaveType leaveType = requestDto.getLeaveType();
        if (leaveType == LeaveType.PAID) {
            leaveType = LeaveType.PAID_LEAVE;
        } else if (leaveType == LeaveType.SICK) {
            leaveType = LeaveType.SICK_LEAVE;
        } else if (leaveType == LeaveType.UNPAID) {
            leaveType = LeaveType.UNPAID_LEAVE;
        }

        // Strictly calculate number of days on the backend
        long days = ChronoUnit.DAYS.between(requestDto.getStartDate(), requestDto.getEndDate()) + 1;

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .leaveType(leaveType)
                .startDate(requestDto.getStartDate())
                .endDate(requestDto.getEndDate())
                .numberOfDays((int) days)
                .reason(requestDto.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        return leaveMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getMyLeaveRequests(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user ID: " + userId));
        return leaveRequestRepository.findByEmployeeOrderByCreatedAtDesc(employee).stream()
                .map(leaveMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getAllLeaveRequests() {
        return leaveRequestRepository.findAll().stream()
                .map(leaveMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LeaveResponse approveLeave(Long leaveId, ApproveLeaveRequest approveRequest) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + leaveId));

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        if (approveRequest != null && approveRequest.getAdminComment() != null) {
            leaveRequest.setAdminComment(approveRequest.getAdminComment());
        }

        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);
        return leaveMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public LeaveResponse rejectLeave(Long leaveId, RejectLeaveRequest rejectRequest) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + leaveId));

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        if (rejectRequest != null) {
            leaveRequest.setAdminComment(rejectRequest.getAdminComment());
        }

        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);
        return leaveMapper.toResponse(updated);
    }
}
