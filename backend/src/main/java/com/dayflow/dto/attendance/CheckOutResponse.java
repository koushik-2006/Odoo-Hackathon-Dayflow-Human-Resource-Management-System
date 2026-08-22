package com.dayflow.dto.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckOutResponse {
    private Long id;
    private LocalDateTime checkOutTime;
    private Double totalHours;
    private String status;
    private String message;
}
