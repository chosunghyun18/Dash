package com.dash.contactrequest.dto;

import com.dash.contactrequest.domain.ContactRequest;
import com.dash.contactrequest.domain.ContactRequestStatus;

import java.time.LocalDateTime;

/**
 * 보낸 연락 요청 (요청자 시점). ACCEPTED 상태일 때만 상대(target)의 연락처가 채워진다.
 */
public record ContactRequestResponse(
    Long id,
    Long targetUserId,
    String targetNickname,
    ContactRequestStatus status,
    LocalDateTime createdAt,
    String contactPhone,
    String contactEmail
) {
    public static ContactRequestResponse of(ContactRequest request, String phone, String email) {
        boolean accepted = request.getStatus() == ContactRequestStatus.ACCEPTED;
        return new ContactRequestResponse(
            request.getId(),
            request.getTarget().getId(),
            request.getTarget().getNickname(),
            request.getStatus(),
            request.getCreatedAt(),
            accepted ? phone : null,
            accepted ? email : null
        );
    }
}
