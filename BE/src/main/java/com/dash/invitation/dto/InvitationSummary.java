package com.dash.invitation.dto;

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
    public static InvitationSummary of(Invitation invitation, String baseUrl) {
        return new InvitationSummary(
            invitation.getId(),
            invitation.getToken(),
            baseUrl + "/invite/" + invitation.getToken(),
            invitation.getStatus(),
            invitation.getInvitee() != null ? invitation.getInvitee().getNickname() : null,
            invitation.getExpiresAt(),
            invitation.getCreatedAt()
        );
    }
}
