package com.dayflow.dto.employee;

import com.dayflow.enums.EmployeeStatus;
import com.dayflow.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private Long userId;
    private String employeeCode;
    private String email;
    private Role role;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;
    private String department;
    private String designation;
    private LocalDate joiningDate;
    private String employmentType;
    private EmployeeStatus status;
    private String profileImage;
}
