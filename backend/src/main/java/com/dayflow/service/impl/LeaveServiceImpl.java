package com.dayflow.service.impl;

import com.dayflow.dto.leave.ApproveLeaveRequest;
import com.dayflow.dto.leave.LeaveRequestDto;
import com.dayflow.dto.leave.LeaveResponse;
import com.dayflow.dto.leave.RejectLeaveRequest;
import com.dayflow.entity.Attendance;
import com.dayflow.entity.Employee;
import com.dayflow.entity.LeaveRequest;
import com.dayflow.entity.Notification;
import com.dayflow.enums.AttendanceStatus;
import com.dayflow.enums.LeaveStatus;
import com.dayflow.enums.LeaveType;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.mapper.LeaveMapper;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.LeaveRequestRepository;
import com.dayflow.repository.NotificationRepository;
import com.dayflow.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final NotificationRepository notificationRepository;
    private final LeaveMapper leaveMapper;

    @Override
    @Transactional
    public LeaveResponse applyLeave(Long userId, LeaveRequestDto requestDto) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user ID: " + userId));

        if (requestDto.getEndDate().isBefore(requestDto.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        // Map shorthand leave types
        LeaveType leaveType = requestDto.getLeaveType();
        if (leaveType == LeaveType.PAID) {
            leaveType = LeaveType.PAID_LEAVE;
        } else if (leaveType == LeaveType.SICK) {
            leaveType = LeaveType.SICK_LEAVE;
        } else if (leaveType == LeaveType.UNPAID) {
            leaveType = LeaveType.UNPAID_LEAVE;
        }

        // Calculate days on backend
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
    public LeaveResponse approveLeave(Long leaveId, ApproveLeaveRequest approveRequest, String approverUsername) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + leaveId));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Cannot approve leave request. Current status is " + leaveRequest.getStatus());
        }

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprovedBy(approverUsername != null ? approverUsername : "ADMIN");
        if (approveRequest != null && approveRequest.getAdminComment() != null) {
            leaveRequest.setAdminComment(approveRequest.getAdminComment());
        }

        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);

        // Module 20: Attendance Integration -> Auto-create/update Attendance records with status = LEAVE
        LocalDate curr = leaveRequest.getStartDate();
        while (!curr.isAfter(leaveRequest.getEndDate())) {
            Optional<Attendance> existingAtt = attendanceRepository.findByEmployeeAndAttendanceDate(leaveRequest.getEmployee(), curr);
            Attendance attendance;
            if (existingAtt.isPresent()) {
                attendance = existingAtt.get();
                attendance.setStatus(AttendanceStatus.LEAVE);
                attendance.setRemarks("Approved Leave: " + leaveRequest.getLeaveType());
            } else {
                attendance = Attendance.builder()
                        .employee(leaveRequest.getEmployee())
                        .attendanceDate(curr)
                        .status(AttendanceStatus.LEAVE)
                        .remarks("Approved Leave: " + leaveRequest.getLeaveType())
                        .build();
            }
            attendanceRepository.save(attendance);
            curr = curr.plusDays(1);
        }

        // Notification Integration
        if (leaveRequest.getEmployee().getUser() != null) {
            Notification notification = Notification.builder()
                    .user(leaveRequest.getEmployee().getUser())
                    .title("Leave Request Approved")
                    .message("Your " + leaveRequest.getLeaveType() + " request from " + leaveRequest.getStartDate() + " to " + leaveRequest.getEndDate() + " has been APPROVED.")
                    .type("LEAVE_APPROVED")
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        }

        return leaveMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public LeaveResponse rejectLeave(Long leaveId, RejectLeaveRequest rejectRequest, String approverUsername) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + leaveId));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Cannot reject leave request. Current status is " + leaveRequest.getStatus());
        }

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setApprovedBy(approverUsername != null ? approverUsername : "ADMIN");
        String comment = rejectRequest != null ? rejectRequest.getEffectiveComment() : "Rejected by administrator";
        leaveRequest.setAdminComment(comment);

        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);

        // Notification Integration
        if (leaveRequest.getEmployee().getUser() != null) {
            Notification notification = Notification.builder()
                    .user(leaveRequest.getEmployee().getUser())
                    .title("Leave Request Rejected")
                    .message("Your " + leaveRequest.getLeaveType() + " request from " + leaveRequest.getStartDate() + " to " + leaveRequest.getEndDate() + " was REJECTED. Reason: " + comment)
                    .type("LEAVE_REJECTED")
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        }

        return leaveMapper.toResponse(updated);
    }
}
