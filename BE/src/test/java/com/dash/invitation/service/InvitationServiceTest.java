package com.dash.invitation.service;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.repository.FriendshipRepository;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.invitation.domain.Invitation;
import com.dash.invitation.domain.InvitationStatus;
import com.dash.invitation.dto.InvitationAcceptResponse;
import com.dash.invitation.dto.InvitationCreateResponse;
import com.dash.invitation.dto.InvitationValidateResponse;
import com.dash.invitation.repository.InvitationRepository;
import com.dash.member.domain.Gender;
import com.dash.member.domain.Member;
import com.dash.member.repository.MemberRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
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
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member(1L, "inviter")));
        when(invitationRepository.existsByToken(anyString())).thenReturn(false);
        when(invitationRepository.save(any(Invitation.class))).thenAnswer(inv -> inv.getArgument(0));

        InvitationCreateResponse res = invitationService.create(1L);

        assertThat(res.token()).isNotBlank();
        assertThat(res.shareUrl()).startsWith("http://localhost:8080/invite/");
        assertThat(res.expiresAt()).isNotNull();
    }

    @Test
    @DisplayName("validate: 유효한 PENDING 초대면 초대자 정보 반환")
    void validate_success() {
        when(invitationRepository.findByTokenWithInviter(TOKEN))
            .thenReturn(Optional.of(invitation(1L, "inviter", InvitationStatus.PENDING)));

        InvitationValidateResponse res = invitationService.validate(TOKEN);

        assertThat(res.token()).isEqualTo(TOKEN);
        assertThat(res.inviterNickname()).isEqualTo("inviter");
    }

    @Test
    @DisplayName("validate: 토큰이 없으면 INVITATION_NOT_FOUND")
    void validate_notFound() {
        when(invitationRepository.findByTokenWithInviter(TOKEN)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> invitationService.validate(TOKEN))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.INVITATION_NOT_FOUND));
    }

    @Test
    @DisplayName("validate: PENDING 이 아니면 INVITATION_NOT_AVAILABLE")
    void validate_notAvailable() {
        when(invitationRepository.findByTokenWithInviter(TOKEN))
            .thenReturn(Optional.of(invitation(1L, "inviter", InvitationStatus.ACCEPTED)));

        assertThatThrownBy(() -> invitationService.validate(TOKEN))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.INVITATION_NOT_AVAILABLE));
    }

    @Test
    @DisplayName("accept: 자기 자신의 초대를 수락하면 CANNOT_INVITE_SELF")
    void accept_self() {
        when(invitationRepository.findByTokenWithInviter(TOKEN))
            .thenReturn(Optional.of(invitation(1L, "inviter", InvitationStatus.PENDING)));
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member(1L, "inviter")));

        assertThatThrownBy(() -> invitationService.accept(TOKEN, 1L))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.CANNOT_INVITE_SELF));
    }

    @Test
    @DisplayName("accept: 이미 친구면 ALREADY_FRIENDS")
    void accept_alreadyFriends() {
        when(invitationRepository.findByTokenWithInviter(TOKEN))
            .thenReturn(Optional.of(invitation(1L, "inviter", InvitationStatus.PENDING)));
        when(memberRepository.findById(2L)).thenReturn(Optional.of(member(2L, "invitee")));
        when(friendshipRepository.existsBetween(1L, 2L)).thenReturn(true);

        assertThatThrownBy(() -> invitationService.accept(TOKEN, 2L))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.ALREADY_FRIENDS));
    }

    @Test
    @DisplayName("accept: 정상 수락 시 ACCEPTED 전환 + Friendship 생성")
    void accept_success() {
        Invitation invitation = invitation(1L, "inviter", InvitationStatus.PENDING);
        when(invitationRepository.findByTokenWithInviter(TOKEN)).thenReturn(Optional.of(invitation));
        when(memberRepository.findById(2L)).thenReturn(Optional.of(member(2L, "invitee")));
        when(friendshipRepository.existsBetween(1L, 2L)).thenReturn(false);
        when(friendshipRepository.save(any(Friendship.class))).thenAnswer(inv -> {
            Friendship f = inv.getArgument(0);
            ReflectionTestUtils.setField(f, "id", 500L);
            return f;
        });

        InvitationAcceptResponse res = invitationService.accept(TOKEN, 2L);

        assertThat(invitation.getStatus()).isEqualTo(InvitationStatus.ACCEPTED);
        assertThat(res.friendshipId()).isEqualTo(500L);
        assertThat(res.inviterNickname()).isEqualTo("inviter");
    }

    // ── fixtures ──
    private Member member(Long id, String nickname) {
        Member m = Member.create("kakao-" + id, nickname, Gender.MALE, 1990, "KR");
        ReflectionTestUtils.setField(m, "id", id);
        return m;
    }

    private Invitation invitation(Long inviterId, String inviterNickname, InvitationStatus status) {
        Invitation inv = Invitation.create(member(inviterId, inviterNickname), TOKEN);
        ReflectionTestUtils.setField(inv, "status", status);
        return inv;
    }
}
