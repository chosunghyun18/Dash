package com.dash.invitation.application;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.domain.FriendshipRepository;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.invitation.domain.Invitation;
import com.dash.invitation.domain.InvitationRepository;
import com.dash.invitation.domain.InvitationStatus;
import com.dash.invitation.domain.InvitationToken;
import com.dash.invitation.presentation.InvitationAcceptResponse;
import com.dash.invitation.presentation.InvitationCreateResponse;
import com.dash.invitation.presentation.InvitationValidateResponse;
import com.dash.member.domain.Gender;
import com.dash.member.domain.Member;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import com.dash.member.domain.MemberStatus;
import com.dash.member.domain.Nickname;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InvitationServiceTest {

    @Mock InvitationRepository invitationRepository;
    @Mock FriendshipRepository friendshipRepository;
    @Mock MemberRepository memberRepository;
    @InjectMocks InvitationService invitationService;

    private static final String TOKEN = "ABC123DEF456";

    @Test
    @DisplayName("create: 토큰을 생성하고 shareUrl 을 baseUrl 기준으로 반환")
    void create_success() {
        ReflectionTestUtils.setField(invitationService, "baseUrl", "http://localhost:8080");
        when(memberRepository.existsById(MemberId.of(1L))).thenReturn(true);
        when(invitationRepository.existsByToken(any(InvitationToken.class))).thenReturn(false);
        when(invitationRepository.save(any(Invitation.class))).thenAnswer(inv -> inv.getArgument(0));

        InvitationCreateResponse res = invitationService.create(1L);

        assertThat(res.token()).isNotBlank();
        assertThat(res.shareUrl()).startsWith("http://localhost:8080/invite/");
        assertThat(res.expiresAt()).isNotNull();
    }

    @Test
    @DisplayName("validate: 유효한 PENDING 초대면 초대자 정보 반환")
    void validate_success() {
        when(invitationRepository.findByToken(InvitationToken.of(TOKEN)))
            .thenReturn(Optional.of(invitation(1L, InvitationStatus.PENDING)));
        when(memberRepository.findById(MemberId.of(1L))).thenReturn(Optional.of(member(1L, "inviter")));

        InvitationValidateResponse res = invitationService.validate(TOKEN);

        assertThat(res.token()).isEqualTo(TOKEN);
        assertThat(res.inviterNickname()).isEqualTo("inviter");
    }

    @Test
    @DisplayName("validate: 토큰이 없으면 INVITATION_NOT_FOUND")
    void validate_notFound() {
        when(invitationRepository.findByToken(InvitationToken.of(TOKEN))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> invitationService.validate(TOKEN))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.INVITATION_NOT_FOUND));
    }

    @Test
    @DisplayName("validate: PENDING 이 아니면 INVITATION_NOT_AVAILABLE")
    void validate_notAvailable() {
        when(invitationRepository.findByToken(InvitationToken.of(TOKEN)))
            .thenReturn(Optional.of(invitation(1L, InvitationStatus.ACCEPTED)));

        assertThatThrownBy(() -> invitationService.validate(TOKEN))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.INVITATION_NOT_AVAILABLE));
    }

    @Test
    @DisplayName("accept: 자기 자신의 초대를 수락하면 CANNOT_INVITE_SELF")
    void accept_self() {
        when(invitationRepository.findByToken(InvitationToken.of(TOKEN)))
            .thenReturn(Optional.of(invitation(1L, InvitationStatus.PENDING)));
        when(memberRepository.existsById(MemberId.of(1L))).thenReturn(true);

        assertThatThrownBy(() -> invitationService.accept(TOKEN, 1L))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.CANNOT_INVITE_SELF));
    }

    @Test
    @DisplayName("accept: 이미 친구면 ALREADY_FRIENDS")
    void accept_alreadyFriends() {
        when(invitationRepository.findByToken(InvitationToken.of(TOKEN)))
            .thenReturn(Optional.of(invitation(1L, InvitationStatus.PENDING)));
        when(memberRepository.existsById(MemberId.of(2L))).thenReturn(true);
        when(friendshipRepository.existsBetween(MemberId.of(1L), MemberId.of(2L))).thenReturn(true);

        assertThatThrownBy(() -> invitationService.accept(TOKEN, 2L))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.ALREADY_FRIENDS));
    }

    @Test
    @DisplayName("accept: 정상 수락 시 ACCEPTED 전환 + Friendship 생성")
    void accept_success() {
        Invitation invitation = invitation(1L, InvitationStatus.PENDING);
        when(invitationRepository.findByToken(InvitationToken.of(TOKEN))).thenReturn(Optional.of(invitation));
        when(memberRepository.existsById(MemberId.of(2L))).thenReturn(true);
        when(friendshipRepository.existsBetween(MemberId.of(1L), MemberId.of(2L))).thenReturn(false);
        when(friendshipRepository.save(any(Friendship.class)))
            .thenReturn(Friendship.reconstitute(500L, MemberId.of(1L), MemberId.of(2L)));
        when(memberRepository.findById(MemberId.of(1L))).thenReturn(Optional.of(member(1L, "inviter")));

        InvitationAcceptResponse res = invitationService.accept(TOKEN, 2L);

        assertThat(invitation.getStatus()).isEqualTo(InvitationStatus.ACCEPTED);
        assertThat(res.friendshipId()).isEqualTo(500L);
        assertThat(res.inviterNickname()).isEqualTo("inviter");
    }

    // ── fixtures ──
    private Member member(long id, String nickname) {
        return Member.reconstitute(MemberId.of(id), "kakao-" + id, Nickname.of(nickname),
            Gender.MALE, 1990, MemberStatus.ACTIVE, "KR");
    }

    private Invitation invitation(long inviterId, InvitationStatus status) {
        return Invitation.reconstitute(10L, MemberId.of(inviterId), InvitationToken.of(TOKEN), status,
            LocalDateTime.now().plusDays(7), null, null, LocalDateTime.now());
    }
}
