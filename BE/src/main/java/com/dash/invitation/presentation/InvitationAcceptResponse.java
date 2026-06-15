package com.dash.invitation.presentation;

import com.dash.invitation.domain.Invitation;

public record InvitationAcceptResponse(
    String token,
    Long friendshipId,
    String inviterNickname
) {
    public static InvitationAcceptResponse of(Invitation invitation, Long friendshipId, String inviterNickname) {
        return new InvitationAcceptResponse(
            invitation.getToken().value(),
            friendshipId,
            inviterNickname
        );
    }
}
