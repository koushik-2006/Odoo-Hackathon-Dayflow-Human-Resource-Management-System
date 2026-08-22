package com.dayflow.repository;

import com.dayflow.entity.Attendance;
import com.dayflow.entity.Employee;
import com.dayflow.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    List<Attendance> findByEmployeeAndAttendanceDateBetweenOrderByAttendanceDateDesc(
            Employee employee, LocalDate startDate, LocalDate endDate);

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
    
    default List<Attendance> findByDate(LocalDate date) {
        return findByAttendanceDate(date);
    }

    long countByAttendanceDateAndStatus(LocalDate attendanceDate, AttendanceStatus status);
    
    default long countByDateAndStatus(LocalDate date, AttendanceStatus status) {
        return countByAttendanceDateAndStatus(date, status);
    }

    @Query("SELECT a FROM Attendance a " +
           "JOIN a.employee e " +
           "WHERE (:employeeId IS NULL OR e.id = :employeeId OR e.employeeCode = :employeeSearch) " +
           "AND (:attendanceDate IS NULL OR a.attendanceDate = :attendanceDate) " +
           "AND (cast(:department as string) IS NULL OR LOWER(e.department) LIKE LOWER(CONCAT('%', cast(:department as string), '%'))) " +
           "AND (:status IS NULL OR a.status = :status) " +
           "ORDER BY a.attendanceDate DESC, a.checkIn DESC")
    List<Attendance> findAdminAttendanceFiltered(
            @Param("employeeId") Long employeeId,
            @Param("employeeSearch") String employeeSearch,
            @Param("attendanceDate") LocalDate attendanceDate,
            @Param("department") String department,
            @Param("status") AttendanceStatus status);
}
