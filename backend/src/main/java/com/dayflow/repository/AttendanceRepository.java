package com.dayflow.repository;

import com.dayflow.entity.Attendance;
import com.dayflow.entity.Employee;
import com.dayflow.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeAndAttendanceDate(Employee employee, LocalDate attendanceDate);
    
    default Optional<Attendance> findByEmployeeAndDate(Employee employee, LocalDate date) {
        return findByEmployeeAndAttendanceDate(employee, date);
    }

    List<Attendance> findByEmployeeOrderByAttendanceDateDesc(Employee employee);
    
    default List<Attendance> findByEmployeeOrderByDateDesc(Employee employee) {
        return findByEmployeeOrderByAttendanceDateDesc(employee);
    }

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
    
    default List<Attendance> findByDate(LocalDate date) {
        return findByAttendanceDate(date);
    }

    long countByAttendanceDateAndStatus(LocalDate attendanceDate, AttendanceStatus status);
    
    default long countByDateAndStatus(LocalDate date, AttendanceStatus status) {
        return countByAttendanceDateAndStatus(date, status);
    }
}
