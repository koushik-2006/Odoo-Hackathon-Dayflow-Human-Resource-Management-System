package com.dayflow.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveSummaryResponse {
    private int totalPaidLeave;
    private int usedPaidLeave;
    private int totalSickLeave;
    private int usedSickLeave;
    private int totalCasualLeave;
    private int usedCasualLeave;
}
