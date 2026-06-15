package com.dash.friendship.infrastructure.persistence;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.domain.FriendshipRepository;
import com.dash.member.domain.MemberId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FriendshipRepositoryAdapter implements FriendshipRepository {

    private final FriendshipJpaRepository jpa;

    @Override
    public Friendship save(Friendship friendship) {
        return FriendshipMapper.toDomain(jpa.save(FriendshipMapper.toEntity(friendship)));
    }

    @Override
    public boolean existsBetween(MemberId a, MemberId b) {
        return jpa.existsBetween(a.value(), b.value());
    }

    @Override
    public List<Friendship> findAllByMember(MemberId id) {
        return jpa.findAllByMemberId(id.value()).stream().map(FriendshipMapper::toDomain).toList();
    }

    @Override
    public long countFriendsExcluding(MemberId id, MemberId excludeId) {
        return jpa.countFriendsExcluding(id.value(), excludeId.value());
    }
}
