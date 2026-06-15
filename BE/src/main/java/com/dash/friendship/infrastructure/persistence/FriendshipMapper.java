package com.dash.friendship.infrastructure.persistence;

import com.dash.friendship.domain.Friendship;
import com.dash.member.domain.MemberId;

final class FriendshipMapper {

    private FriendshipMapper() {
    }

    static Friendship toDomain(FriendshipJpaEntity e) {
        return Friendship.reconstitute(e.getId(), MemberId.of(e.getMemberAId()), MemberId.of(e.getMemberBId()));
    }

    static FriendshipJpaEntity toEntity(Friendship f) {
        return new FriendshipJpaEntity(f.getId(), f.getMemberA().value(), f.getMemberB().value());
    }
}
