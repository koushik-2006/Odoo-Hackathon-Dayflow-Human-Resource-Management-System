package com.dayflow.repository;

import com.dayflow.entity.Employee;
import com.dayflow.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByEmployeeOrderByYearDescMonthDesc(Employee employee);
    Optional<Payroll> findByEmployeeAndMonthAndYear(Employee employee, String month, Integer year);
}
