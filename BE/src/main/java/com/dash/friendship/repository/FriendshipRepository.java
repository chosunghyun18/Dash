package com.dash.friendship.repository;

import com.dash.friendship.domain.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT COUNT(f) > 0 FROM Friendship f WHERE " +
           "(f.memberA.id = :aId AND f.memberB.id = :bId) OR " +
           "(f.memberA.id = :bId AND f.memberB.id = :aId)")
    boolean existsBetween(@Param("aId") Long aId, @Param("bId") Long bId);
}
