package com.dayflow.controller;

import com.dayflow.dto.payroll.PayrollResponse;
import com.dayflow.dto.payroll.UpdatePayrollRequest;
import com.dayflow.security.CustomUserDetails;
import com.dayflow.service.PayrollService;
import com.dayflow.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
@Tag(name = "Payroll Management", description = "Endpoints for employee payslips and payroll processing")
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping("/my-slips")
    @Operation(summary = "Get employee's personal payslips")
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getMyPayslips(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<PayrollResponse> payslips = payrollService.getMyPayslips(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(payslips));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Get company payroll records (Admin/HR only)")
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getAllPayrolls() {
        List<PayrollResponse> payrolls = payrollService.getAllPayrolls();
        return ResponseEntity.ok(ApiResponse.success(payrolls));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Update payroll record (Admin/HR only)")
    public ResponseEntity<ApiResponse<PayrollResponse>> updatePayroll(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePayrollRequest request
    ) {
        PayrollResponse response = payrollService.updatePayroll(id, request);
        return ResponseEntity.ok(ApiResponse.success("Payroll updated", response));
    }
}
