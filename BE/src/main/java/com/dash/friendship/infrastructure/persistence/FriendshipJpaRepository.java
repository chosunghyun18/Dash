package com.dash.friendship.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

interface FriendshipJpaRepository extends JpaRepository<FriendshipJpaEntity, Long> {

    @Query("SELECT COUNT(f) > 0 FROM FriendshipJpaEntity f WHERE " +
           "(f.memberAId = :a AND f.memberBId = :b) OR (f.memberAId = :b AND f.memberBId = :a)")
    boolean existsBetween(@Param("a") Long a, @Param("b") Long b);

    @Query("SELECT f FROM FriendshipJpaEntity f WHERE " +
           "f.memberAId = :id OR f.memberBId = :id ORDER BY f.createdAt DESC")
    List<FriendshipJpaEntity> findAllByMemberId(@Param("id") Long id);

    @Query("SELECT COUNT(f) FROM FriendshipJpaEntity f WHERE " +
           "(f.memberAId = :id OR f.memberBId = :id) " +
           "AND f.memberAId <> :excludeId AND f.memberBId <> :excludeId")
    long countFriendsExcluding(@Param("id") Long id, @Param("excludeId") Long excludeId);
}
