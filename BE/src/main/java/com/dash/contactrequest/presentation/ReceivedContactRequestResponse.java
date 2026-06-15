package com.dash.contactrequest.presentation;

import com.dash.contactrequest.domain.ContactRequest;
import com.dash.contactrequest.domain.ContactRequestStatus;

import java.time.LocalDateTime;

/**
 * 받은 연락 요청 (수신자 시점). ACCEPTED 상태일 때만 상대(requester)의 연락처가 채워진다.
 */
public record ReceivedContactRequestResponse(
    Long id,
    Long requesterUserId,
    String requesterNickname,
    ContactRequestStatus status,
    LocalDateTime createdAt,
    String contactPhone,
    String contactEmail
) {
    public static ReceivedContactRequestResponse of(ContactRequest request, String requesterNickname,
                                                    String phone, String email) {
        boolean accepted = request.isAccepted();
        return new ReceivedContactRequestResponse(
            request.getId(),
            request.getRequester().value(),
            requesterNickname,
            request.getStatus(),
            request.getCreatedAt(),
            accepted ? phone : null,
            accepted ? email : null
        );
    }
}
