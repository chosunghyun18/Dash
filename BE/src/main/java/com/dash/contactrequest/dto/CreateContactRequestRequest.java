package com.dash.contactrequest.dto;

import jakarta.validation.constraints.NotNull;

public record CreateContactRequestRequest(
    @NotNull(message = "targetUserId 는 필수입니다")
    Long targetUserId
) {
}
