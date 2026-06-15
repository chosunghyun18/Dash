package com.dash.contactrequest.domain;

import com.dash.member.domain.MemberId;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 연락 요청 애그리거트 루트 (순수 도메인). requester/target 은 {@link MemberId} 로 참조한다.
 * 연락처 자체는 보유하지 않으며, 수락 시 프로필에서 조회해 노출한다.
 */
@Getter
public class ContactRequest {

    private final Long id;             // 신규 생성 시 null
    private final MemberId requester;
    private final MemberId target;
    private ContactRequestStatus status;
    private final LocalDateTime createdAt;  // 영속 후 채워짐

    private ContactRequest(Long id, MemberId requester, MemberId target,
                           ContactRequestStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.requester = requester;
        this.target = target;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static ContactRequest create(MemberId requester, MemberId target) {
        return new ContactRequest(null, requester, target, ContactRequestStatus.PENDING, null);
    }

    public static ContactRequest reconstitute(Long id, MemberId requester, MemberId target,
                                              ContactRequestStatus status, LocalDateTime createdAt) {
        return new ContactRequest(id, requester, target, status, createdAt);
    }

    public boolean isPending() {
        return status == ContactRequestStatus.PENDING;
    }

    public boolean isAccepted() {
        return status == ContactRequestStatus.ACCEPTED;
    }

    public boolean isTargetedAt(MemberId memberId) {
        return target.equals(memberId);
    }

    public void accept() {
        this.status = ContactRequestStatus.ACCEPTED;
    }

    public void reject() {
        this.status = ContactRequestStatus.REJECTED;
    }
}
