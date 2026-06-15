package com.dash.member.infrastructure.persistence;

import com.dash.member.domain.Member;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.Nickname;

final class MemberMapper {

    private MemberMapper() {
    }

    static Member toDomain(MemberJpaEntity e) {
        return Member.reconstitute(
            MemberId.of(e.getId()),
            e.getKakaoId(),
            Nickname.of(e.getNickname()),
            e.getGender(),
            e.getBirthYear(),
            e.getStatus(),
            e.getCountry()
        );
    }

    static MemberJpaEntity toEntity(Member m) {
        return new MemberJpaEntity(
            m.getId() == null ? null : m.getId().value(),
            m.getKakaoId(),
            m.getNickname().value(),
            m.getGender(),
            m.getBirthYear(),
            m.getStatus(),
            m.getCountry()
        );
    }
}
