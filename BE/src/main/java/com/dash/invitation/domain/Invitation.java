package com.dash.invitation.domain;

import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inviter_id", nullable = false)
    private Member inviter;

    @Column(nullable = false, unique = true, length = 12)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InvitationStatus status;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitee_id")
    private Member invitee;

    private LocalDateTime acceptedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public static Invitation create(Member inviter, String token) {
        Invitation inv = new Invitation();
        inv.inviter = inviter;
        inv.token = token;
        inv.status = InvitationStatus.PENDING;
        inv.expiresAt = LocalDateTime.now().plusDays(7);
        return inv;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public void accept(Member invitee) {
        if (this.status != InvitationStatus.PENDING) {
            throw new BusinessException(ErrorCode.INVITATION_NOT_AVAILABLE);
        }
        if (isExpired()) {
            this.status = InvitationStatus.EXPIRED;
            throw new BusinessException(ErrorCode.INVITATION_EXPIRED);
        }
        this.invitee = invitee;
        this.status = InvitationStatus.ACCEPTED;
        this.acceptedAt = LocalDateTime.now();
    }
}
