package com.dash.invitation.infrastructure.persistence;

import com.dash.invitation.domain.Invitation;
import com.dash.invitation.domain.InvitationToken;
import com.dash.member.domain.MemberId;

final class InvitationMapper {

    private InvitationMapper() {
    }

    static Invitation toDomain(InvitationJpaEntity e) {
        return Invitation.reconstitute(
            e.getId(),
            MemberId.of(e.getInviterId()),
            InvitationToken.of(e.getToken()),
            e.getStatus(),
            e.getExpiresAt(),
            e.getInviteeId() == null ? null : MemberId.of(e.getInviteeId()),
            e.getAcceptedAt(),
            e.getCreatedAt()
        );
    }

    static InvitationJpaEntity toEntity(Invitation i) {
        return new InvitationJpaEntity(
            i.getId(),
            i.getInviter().value(),
            i.getToken().value(),
            i.getStatus(),
            i.getExpiresAt(),
            i.getInvitee() == null ? null : i.getInvitee().value(),
            i.getAcceptedAt(),
            i.getCreatedAt()
        );
    }
}
