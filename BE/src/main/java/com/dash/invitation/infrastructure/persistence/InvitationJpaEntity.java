package com.dash.invitation.infrastructure.persistence;

import com.dash.invitation.domain.InvitationStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class InvitationJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inviter_id", nullable = false)
    private Long inviterId;

    @Column(nullable = false, unique = true, length = 12)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InvitationStatus status;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "invitee_id")
    private Long inviteeId;

    private LocalDateTime acceptedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public InvitationJpaEntity(Long id, Long inviterId, String token, InvitationStatus status,
                               LocalDateTime expiresAt, Long inviteeId, LocalDateTime acceptedAt,
                               LocalDateTime createdAt) {
        this.id = id;
        this.inviterId = inviterId;
        this.token = token;
        this.status = status;
        this.expiresAt = expiresAt;
        this.inviteeId = inviteeId;
        this.acceptedAt = acceptedAt;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
