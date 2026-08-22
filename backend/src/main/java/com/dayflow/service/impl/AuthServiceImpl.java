package com.dayflow.service.impl;

import com.dayflow.dto.auth.AuthResponse;
import com.dayflow.dto.auth.LoginRequest;
import com.dayflow.dto.auth.LoginResponse;
import com.dayflow.dto.auth.RegisterRequest;
import com.dayflow.entity.Employee;
import com.dayflow.entity.User;
import com.dayflow.enums.EmployeeStatus;
import com.dayflow.exception.DuplicateResourceException;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.CustomUserDetails;
import com.dayflow.security.JwtService;
import com.dayflow.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email address '" + request.getEmail() + "' is already registered");
        }
        if (userRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new DuplicateResourceException("Employee ID '" + request.getEmployeeId() + "' already exists");
        }

        User user = User.builder()
                .employeeId(request.getEmployeeId())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isVerified(true)
                .build();

        User savedUser = userRepository.save(user);

        // Auto-create associated Employee profile
        String firstName = (request.getFirstName() != null && !request.getFirstName().isBlank())
                ? request.getFirstName() : "Employee";
        String lastName = (request.getLastName() != null && !request.getLastName().isBlank())
                ? request.getLastName() : request.getEmployeeId();

        Employee employee = Employee.builder()
                .user(savedUser)
                .employeeCode(request.getEmployeeId())
                .firstName(firstName)
                .lastName(lastName)
                .department(request.getDepartment() != null ? request.getDepartment() : "General")
                .designation(request.getDesignation() != null ? request.getDesignation() : request.getRole().name())
                .joiningDate(LocalDate.now())
                .status(EmployeeStatus.ACTIVE)
                .build();

        employeeRepository.save(employee);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .role(savedUser.getRole())
                .userId(savedUser.getId())
                .employeeId(savedUser.getEmployeeId())
                .email(savedUser.getEmail())
                .message("User registered successfully")
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getLoginId(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String token = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .role(user.getRole())
                .userId(user.getId())
                .employeeId(user.getEmployeeId())
                .email(user.getEmail())
                .build();
    }
}
