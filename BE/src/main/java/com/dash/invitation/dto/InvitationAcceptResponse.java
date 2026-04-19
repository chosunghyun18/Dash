package com.dash.invitation.dto;

import com.dash.friendship.domain.Friendship;
import com.dash.invitation.domain.Invitation;

public record InvitationAcceptResponse(
    String token,
    Long friendshipId,
    String inviterNickname
) {
    public static InvitationAcceptResponse of(Invitation invitation, Friendship friendship) {
        return new InvitationAcceptResponse(
            invitation.getToken(),
            friendship.getId(),
            invitation.getInviter().getNickname()
        );
    }
}
