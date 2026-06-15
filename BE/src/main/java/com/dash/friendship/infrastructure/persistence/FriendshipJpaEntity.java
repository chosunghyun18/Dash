package com.dash.friendship.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "friendships",
    uniqueConstraints = @UniqueConstraint(columnNames = {"member_a_id", "member_b_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FriendshipJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_a_id", nullable = false)
    private Long memberAId;

    @Column(name = "member_b_id", nullable = false)
    private Long memberBId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public FriendshipJpaEntity(Long id, Long memberAId, Long memberBId) {
        this.id = id;
        this.memberAId = memberAId;
        this.memberBId = memberBId;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
