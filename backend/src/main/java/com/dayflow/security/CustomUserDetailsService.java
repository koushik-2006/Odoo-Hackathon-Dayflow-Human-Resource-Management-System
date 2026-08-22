package com.dayflow.security;

import com.dayflow.entity.User;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmployeeId) throws UsernameNotFoundException {
        User user = userRepository.findByEmailOrEmployeeId(usernameOrEmployeeId, usernameOrEmployeeId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or employeeId: " + usernameOrEmployeeId));
        return new CustomUserDetails(user);
    }
}
