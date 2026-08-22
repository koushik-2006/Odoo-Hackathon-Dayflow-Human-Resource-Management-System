package com.dayflow.dto.leave;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RejectLeaveRequest {

    @NotBlank(message = "Rejection comment is required")
    private String adminComment;
}
