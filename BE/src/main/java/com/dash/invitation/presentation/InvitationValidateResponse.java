package com.dash.invitation.presentation;

import com.dash.invitation.domain.Invitation;

import java.time.LocalDateTime;

public record InvitationValidateResponse(
    String token,
    String inviterNickname,
    LocalDateTime expiresAt
) {
    public static InvitationValidateResponse of(Invitation invitation, String inviterNickname) {
        return new InvitationValidateResponse(
            invitation.getToken().value(),
            inviterNickname,
            invitation.getExpiresAt()
        );
    }
}
