package com.dayflow.service;

import com.dayflow.dto.auth.AuthResponse;
import com.dayflow.dto.auth.LoginRequest;
import com.dayflow.dto.auth.LoginResponse;
import com.dayflow.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    LoginResponse login(LoginRequest loginRequest);
}
