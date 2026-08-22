package com.dayflow.dto.auth;

import com.dayflow.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Role role;
    private Long userId;
    private String employeeId;
    private String email;
}
