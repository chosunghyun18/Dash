package com.dash.invitation.presentation;

import com.dash.invitation.domain.Invitation;
import com.dash.invitation.domain.InvitationStatus;

import java.time.LocalDateTime;

public record InvitationSummary(
    Long id,
    String token,
    String shareUrl,
    InvitationStatus status,
    String inviteeNickname,
    LocalDateTime expiresAt,
    LocalDateTime createdAt
) {
    public static InvitationSummary of(Invitation invitation, String baseUrl, String inviteeNickname) {
        return new InvitationSummary(
            invitation.getId(),
            invitation.getToken().value(),
            baseUrl + "/invite/" + invitation.getToken().value(),
            invitation.getStatus(),
            inviteeNickname,
            invitation.getExpiresAt(),
            invitation.getCreatedAt()
        );
    }
}
