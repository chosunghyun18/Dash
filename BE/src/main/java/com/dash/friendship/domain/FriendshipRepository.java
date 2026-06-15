package com.dash.friendship.domain;

import com.dash.member.domain.MemberId;

import java.util.List;

/** 친구 관계 저장소 포트 (도메인 소유). */
public interface FriendshipRepository {

    Friendship save(Friendship friendship);

    boolean existsBetween(MemberId a, MemberId b);

    /** 특정 회원이 속한 모든 친구 관계 (createdAt 내림차순). */
    List<Friendship> findAllByMember(MemberId id);

    /** id 의 친구 중 excludeId(탐색해 온 노드)를 제외한 친구 수. */
    long countFriendsExcluding(MemberId id, MemberId excludeId);
}
