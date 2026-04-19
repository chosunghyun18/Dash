package com.dash.invitation.dto;

import com.dash.invitation.domain.Invitation;

import java.time.LocalDateTime;

public record InvitationCreateResponse(
    String token,
    String shareUrl,
    LocalDateTime expiresAt
) {
    public static InvitationCreateResponse of(Invitation invitation, String baseUrl) {
        return new InvitationCreateResponse(
            invitation.getToken(),
            baseUrl + "/invite/" + invitation.getToken(),
            invitation.getExpiresAt()
        );
    }
}
