package com.dash.friendship.repository;

import com.dash.friendship.domain.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT COUNT(f) > 0 FROM Friendship f WHERE " +
           "(f.memberA.id = :aId AND f.memberB.id = :bId) OR " +
           "(f.memberA.id = :bId AND f.memberB.id = :aId)")
    boolean existsBetween(@Param("aId") Long aId, @Param("bId") Long bId);

    /** 특정 회원이 속한 모든 친구 관계 (양방향) — 상대 회원까지 fetch join. */
    @Query("SELECT f FROM Friendship f " +
           "JOIN FETCH f.memberA JOIN FETCH f.memberB " +
           "WHERE f.memberA.id = :id OR f.memberB.id = :id " +
           "ORDER BY f.createdAt DESC")
    List<Friendship> findAllByMemberId(@Param("id") Long id);

    /** 회원 id 의 친구 중 excludeId(탐색해 온 노드)를 제외한 친구 수. 추가 탐색 가능 여부 판정용. */
    @Query("SELECT COUNT(f) FROM Friendship f WHERE " +
           "(f.memberA.id = :id OR f.memberB.id = :id) " +
           "AND f.memberA.id <> :excludeId AND f.memberB.id <> :excludeId")
    long countFriendsExcluding(@Param("id") Long id, @Param("excludeId") Long excludeId);
}
