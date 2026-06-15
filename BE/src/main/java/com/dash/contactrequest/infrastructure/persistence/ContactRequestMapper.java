package com.dash.contactrequest.infrastructure.persistence;

import com.dash.contactrequest.domain.ContactRequest;
import com.dash.member.domain.MemberId;

final class ContactRequestMapper {

    private ContactRequestMapper() {
    }

    static ContactRequest toDomain(ContactRequestJpaEntity e) {
        return ContactRequest.reconstitute(
            e.getId(),
            MemberId.of(e.getRequesterId()),
            MemberId.of(e.getTargetId()),
            e.getStatus(),
            e.getCreatedAt()
        );
    }

    static ContactRequestJpaEntity toEntity(ContactRequest r) {
        return new ContactRequestJpaEntity(
            r.getId(),
            r.getRequester().value(),
            r.getTarget().value(),
            r.getStatus(),
            r.getCreatedAt()
        );
    }
}
