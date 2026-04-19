package com.dash.friendship.domain;

import com.dash.member.domain.Member;
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
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_a_id", nullable = false)
    private Member memberA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_b_id", nullable = false)
    private Member memberB;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    /** member_a_id < member_b_id 를 보장하여 중복 row 방지 */
    public static Friendship create(Member a, Member b) {
        Friendship f = new Friendship();
        if (a.getId() < b.getId()) {
            f.memberA = a;
            f.memberB = b;
        } else {
            f.memberA = b;
            f.memberB = a;
        }
        return f;
    }
}
