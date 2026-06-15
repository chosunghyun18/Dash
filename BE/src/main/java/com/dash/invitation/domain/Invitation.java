package com.dash.invitation.domain;

import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.MemberId;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 초대 애그리거트 루트 (순수 도메인). inviter/invitee 는 {@link MemberId} 로 참조한다.
 * 상태 전이(수락/만료) 불변식을 도메인이 강제한다.
 */
@Getter
public class Invitation {

    private static final int EXPIRY_DAYS = 7;

    private final Long id;             // 신규 생성 시 null
    private final MemberId inviter;
    private final InvitationToken token;
    private InvitationStatus status;
    private final LocalDateTime expiresAt;
    private MemberId invitee;          // 수락 전 null
    private LocalDateTime acceptedAt;  // 수락 전 null
    private final LocalDateTime createdAt;  // 영속 후 채워짐 (신규 생성 시 null)

    private Invitation(Long id, MemberId inviter, InvitationToken token, InvitationStatus status,
                       LocalDateTime expiresAt, MemberId invitee, LocalDateTime acceptedAt,
                       LocalDateTime createdAt) {
        this.id = id;
        this.inviter = inviter;
        this.token = token;
        this.status = status;
        this.expiresAt = expiresAt;
        this.invitee = invitee;
        this.acceptedAt = acceptedAt;
        this.createdAt = createdAt;
    }

    public static Invitation create(MemberId inviter, InvitationToken token) {
        return new Invitation(null, inviter, token, InvitationStatus.PENDING,
            LocalDateTime.now().plusDays(EXPIRY_DAYS), null, null, null);
    }

    public static Invitation reconstitute(Long id, MemberId inviter, InvitationToken token,
                                          InvitationStatus status, LocalDateTime expiresAt,
                                          MemberId invitee, LocalDateTime acceptedAt,
                                          LocalDateTime createdAt) {
        return new Invitation(id, inviter, token, status, expiresAt, invitee, acceptedAt, createdAt);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isPending() {
        return status == InvitationStatus.PENDING;
    }

    public void accept(MemberId invitee) {
        if (status != InvitationStatus.PENDING) {
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
