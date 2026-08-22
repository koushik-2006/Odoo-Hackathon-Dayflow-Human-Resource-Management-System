package com.dayflow.dto.leave;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RejectLeaveRequest {

    private String adminComment;
    private String comment;

    public String getEffectiveComment() {
        if (comment != null && !comment.trim().isEmpty()) {
            return comment;
        }
        if (adminComment != null && !adminComment.trim().isEmpty()) {
            return adminComment;
        }
        return "Rejected by administrator";
    }
}
