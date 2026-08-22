package com.dayflow.controller;

import com.dayflow.dto.dashboard.DashboardStatsResponse;
import com.dayflow.service.DashboardService;
import com.dayflow.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'HR')")
@RequiredArgsConstructor
@Tag(name = "Admin Operations", description = "Endpoints restricted exclusively to Administrators and HR Managers")
public class AdminController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    @Operation(summary = "Get admin control center overview statistics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getAdminOverview() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
