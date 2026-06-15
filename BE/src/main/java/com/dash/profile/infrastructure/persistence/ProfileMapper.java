package com.dash.profile.infrastructure.persistence;

import com.dash.member.domain.MemberId;
import com.dash.profile.domain.Contact;
import com.dash.profile.domain.Profile;

final class ProfileMapper {

    private ProfileMapper() {
    }

    static Profile toDomain(ProfileJpaEntity e) {
        return Profile.reconstitute(
            MemberId.of(e.getMemberId()),
            e.getIntroText(),
            e.getProfileImageUrl(),
            Contact.reconstitute(e.getPhone(), e.getEmail())
        );
    }

    static ProfileJpaEntity toEntity(Profile p) {
        return new ProfileJpaEntity(
            p.getMemberId().value(),
            p.getIntroText(),
            p.getProfileImageUrl(),
            p.getPhone(),
            p.getEmail()
        );
    }
}
