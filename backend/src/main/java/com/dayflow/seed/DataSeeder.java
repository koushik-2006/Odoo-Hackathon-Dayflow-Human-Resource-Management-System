package com.dayflow.seed;

import com.dayflow.entity.Employee;
import com.dayflow.entity.User;
import com.dayflow.enums.EmployeeStatus;
import com.dayflow.enums.Role;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Admin User
            User admin = User.builder()
                    .employeeId("EMP001")
                    .email("admin@dayflow.io")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .isVerified(true)
                    .build();
            User savedAdmin = userRepository.save(admin);

            Employee adminEmp = Employee.builder()
                    .user(savedAdmin)
                    .employeeCode("EMP001")
                    .firstName("System")
                    .lastName("Admin")
                    .department("Management")
                    .designation("System Administrator")
                    .joiningDate(LocalDate.of(2024, 1, 1))
                    .status(EmployeeStatus.ACTIVE)
                    .build();
            employeeRepository.save(adminEmp);

            // Seed HR User
            User hr = User.builder()
                    .employeeId("EMP002")
                    .email("hr@dayflow.io")
                    .password(passwordEncoder.encode("HR@12345"))
                    .role(Role.HR)
                    .isVerified(true)
                    .build();
            User savedHr = userRepository.save(hr);

            Employee hrEmp = Employee.builder()
                    .user(savedHr)
                    .employeeCode("EMP002")
                    .firstName("Sarah")
                    .lastName("Jenkins")
                    .department("Human Resources")
                    .designation("HR Lead")
                    .joiningDate(LocalDate.of(2024, 2, 1))
                    .status(EmployeeStatus.ACTIVE)
                    .build();
            employeeRepository.save(hrEmp);

            // Seed Regular Employee User
            User emp = User.builder()
                    .employeeId("EMP003")
                    .email("employee@dayflow.io")
                    .password(passwordEncoder.encode("Employee@123"))
                    .role(Role.EMPLOYEE)
                    .isVerified(true)
                    .build();
            User savedEmp = userRepository.save(emp);

            Employee regularEmp = Employee.builder()
                    .user(savedEmp)
                    .employeeCode("EMP003")
                    .firstName("John")
                    .lastName("Doe")
                    .department("Software Engineering")
                    .designation("Full Stack Engineer")
                    .joiningDate(LocalDate.of(2024, 3, 15))
                    .status(EmployeeStatus.ACTIVE)
                    .build();
            employeeRepository.save(regularEmp);

            System.out.println(">>> Dayflow DataSeeder: Default Admin, HR, and Employee users seeded successfully!");
        }
    }
}
