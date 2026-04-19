package com.dash.invitation.dto;

import com.dash.invitation.domain.Invitation;

import java.time.LocalDateTime;

public record InvitationValidateResponse(
    String token,
    String inviterNickname,
    LocalDateTime expiresAt
) {
    public static InvitationValidateResponse of(Invitation invitation) {
        return new InvitationValidateResponse(
            invitation.getToken(),
            invitation.getInviter().getNickname(),
            invitation.getExpiresAt()
        );
    }
}
