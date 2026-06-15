package com.dash.contactrequest.application;

import com.dash.contactrequest.domain.ContactRequest;
import com.dash.contactrequest.domain.ContactRequestRepository;
import com.dash.contactrequest.domain.ContactRequestStatus;
import com.dash.contactrequest.presentation.AcceptContactResponse;
import com.dash.contactrequest.presentation.ContactRequestResponse;
import com.dash.contactrequest.presentation.ReceivedContactRequestResponse;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Gender;
import com.dash.member.domain.Member;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import com.dash.member.domain.MemberStatus;
import com.dash.member.domain.Nickname;
import com.dash.profile.domain.Contact;
import com.dash.profile.domain.Profile;
import com.dash.profile.domain.ProfileRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ContactRequestServiceTest {

    @Mock ContactRequestRepository contactRequestRepository;
    @Mock MemberRepository memberRepository;
    @Mock ProfileRepository profileRepository;
    @InjectMocks ContactRequestService contactRequestService;

    private static final long REQUESTER = 1L;
    private static final long TARGET = 2L;

    @Test
    @DisplayName("create: 정상 생성 시 PENDING, 연락처 미노출")
    void create_success() {
        when(memberRepository.findById(MemberId.of(TARGET))).thenReturn(Optional.of(member(TARGET, "target")));
        when(memberRepository.existsById(MemberId.of(REQUESTER))).thenReturn(true);
        when(contactRequestRepository.existsByRequesterAndTarget(MemberId.of(REQUESTER), MemberId.of(TARGET)))
            .thenReturn(false);
        when(contactRequestRepository.save(any(ContactRequest.class))).thenAnswer(inv -> inv.getArgument(0));

        ContactRequestResponse res = contactRequestService.create(REQUESTER, TARGET);

        assertThat(res.targetUserId()).isEqualTo(TARGET);
        assertThat(res.targetNickname()).isEqualTo("target");
        assertThat(res.status()).isEqualTo(ContactRequestStatus.PENDING);
        assertThat(res.contactPhone()).isNull();
        assertThat(res.contactEmail()).isNull();
    }

    @Test
    @DisplayName("create: 자기 자신에게 요청하면 CANNOT_REQUEST_SELF")
    void create_self() {
        assertThatThrownBy(() -> contactRequestService.create(REQUESTER, REQUESTER))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.CANNOT_REQUEST_SELF));
        verify(contactRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("create: 대상 회원이 없으면 MEMBER_NOT_FOUND")
    void create_targetNotFound() {
        when(memberRepository.findById(MemberId.of(TARGET))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactRequestService.create(REQUESTER, TARGET))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Test
    @DisplayName("create: 동일 대상 중복 요청이면 CONTACT_REQUEST_ALREADY_EXISTS")
    void create_duplicate() {
        when(memberRepository.findById(MemberId.of(TARGET))).thenReturn(Optional.of(member(TARGET, "target")));
        when(memberRepository.existsById(MemberId.of(REQUESTER))).thenReturn(true);
        when(contactRequestRepository.existsByRequesterAndTarget(MemberId.of(REQUESTER), MemberId.of(TARGET)))
            .thenReturn(true);

        assertThatThrownBy(() -> contactRequestService.create(REQUESTER, TARGET))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.CONTACT_REQUEST_ALREADY_EXISTS));
    }

    @Test
    @DisplayName("getSent: ACCEPTED 는 상대(target) 연락처 포함, PENDING 은 미포함")
    void getSent_exposesTargetContactOnlyWhenAccepted() {
        when(contactRequestRepository.findSentByRequester(MemberId.of(REQUESTER))).thenReturn(List.of(
            cr(10L, REQUESTER, 2L, ContactRequestStatus.ACCEPTED),
            cr(11L, REQUESTER, 3L, ContactRequestStatus.PENDING)
        ));
        when(memberRepository.findAllByIds(anyList())).thenReturn(List.of(member(2L, "t2"), member(3L, "t3")));
        when(profileRepository.findAllByMemberIds(anyList()))
            .thenReturn(List.of(profile(2L, "010-2222", null), profile(3L, "010-3333", null)));

        List<ContactRequestResponse> sent = contactRequestService.getSent(REQUESTER);

        ContactRequestResponse accepted = sent.stream().filter(r -> r.targetUserId() == 2L).findFirst().orElseThrow();
        ContactRequestResponse pending = sent.stream().filter(r -> r.targetUserId() == 3L).findFirst().orElseThrow();
        assertThat(accepted.contactPhone()).isEqualTo("010-2222");
        assertThat(accepted.targetNickname()).isEqualTo("t2");
        assertThat(pending.contactPhone()).isNull();
    }

    @Test
    @DisplayName("getReceived: ACCEPTED 는 상대(requester) 연락처 포함")
    void getReceived_exposesRequesterContactWhenAccepted() {
        when(contactRequestRepository.findReceivedByTarget(MemberId.of(TARGET))).thenReturn(List.of(
            cr(20L, 5L, TARGET, ContactRequestStatus.ACCEPTED)
        ));
        when(memberRepository.findAllByIds(anyList())).thenReturn(List.of(member(5L, "r5")));
        when(profileRepository.findAllByMemberIds(anyList())).thenReturn(List.of(profile(5L, null, "r5@x.com")));

        List<ReceivedContactRequestResponse> received = contactRequestService.getReceived(TARGET);

        assertThat(received).hasSize(1);
        assertThat(received.get(0).requesterUserId()).isEqualTo(5L);
        assertThat(received.get(0).contactEmail()).isEqualTo("r5@x.com");
    }

    @Test
    @DisplayName("accept: 수신자가 수락하면 ACCEPTED 전환 + 요청자(상대) 연락처 반환")
    void accept_success() {
        ContactRequest request = cr(100L, REQUESTER, TARGET, ContactRequestStatus.PENDING);
        when(contactRequestRepository.findById(100L)).thenReturn(Optional.of(request));
        when(profileRepository.findByMemberId(MemberId.of(REQUESTER)))
            .thenReturn(Optional.of(profile(REQUESTER, "010-1111", null)));

        AcceptContactResponse res = contactRequestService.accept(100L, TARGET);

        assertThat(request.getStatus()).isEqualTo(ContactRequestStatus.ACCEPTED);
        assertThat(res.requestId()).isEqualTo(100L);
        assertThat(res.contactPhone()).isEqualTo("010-1111");
    }

    @Test
    @DisplayName("accept: 수신자가 아니면 CONTACT_REQUEST_FORBIDDEN")
    void accept_forbidden() {
        when(contactRequestRepository.findById(100L))
            .thenReturn(Optional.of(cr(100L, REQUESTER, TARGET, ContactRequestStatus.PENDING)));

        assertThatThrownBy(() -> contactRequestService.accept(100L, 999L))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.CONTACT_REQUEST_FORBIDDEN));
    }

    @Test
    @DisplayName("accept: 이미 처리된 요청이면 CONTACT_REQUEST_NOT_PENDING")
    void accept_notPending() {
        when(contactRequestRepository.findById(100L))
            .thenReturn(Optional.of(cr(100L, REQUESTER, TARGET, ContactRequestStatus.ACCEPTED)));

        assertThatThrownBy(() -> contactRequestService.accept(100L, TARGET))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.CONTACT_REQUEST_NOT_PENDING));
    }

    @Test
    @DisplayName("accept: 요청이 없으면 CONTACT_REQUEST_NOT_FOUND")
    void accept_notFound() {
        when(contactRequestRepository.findById(100L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactRequestService.accept(100L, TARGET))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.CONTACT_REQUEST_NOT_FOUND));
    }

    @Test
    @DisplayName("reject: 수신자가 거절하면 REJECTED 전환")
    void reject_success() {
        ContactRequest request = cr(100L, REQUESTER, TARGET, ContactRequestStatus.PENDING);
        when(contactRequestRepository.findById(100L)).thenReturn(Optional.of(request));

        contactRequestService.reject(100L, TARGET);

        assertThat(request.getStatus()).isEqualTo(ContactRequestStatus.REJECTED);
    }

    // ── fixtures ──
    private Member member(long id, String nickname) {
        return Member.reconstitute(MemberId.of(id), "kakao-" + id, Nickname.of(nickname),
            Gender.MALE, 1990, MemberStatus.ACTIVE, "KR");
    }

    private ContactRequest cr(long id, long requesterId, long targetId, ContactRequestStatus status) {
        return ContactRequest.reconstitute(id, MemberId.of(requesterId), MemberId.of(targetId), status, null);
    }

    private Profile profile(long memberId, String phone, String email) {
        return Profile.reconstitute(MemberId.of(memberId), "", null, Contact.reconstitute(phone, email));
    }
}
