package com.dash.user.application;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.domain.FriendshipRepository;
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
import com.dash.user.presentation.AcquaintanceResponse;
import com.dash.user.presentation.UserProfileResponse;
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
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserQueryServiceTest {

    @Mock MemberRepository memberRepository;
    @Mock ProfileRepository profileRepository;
    @Mock FriendshipRepository friendshipRepository;
    @InjectMocks UserQueryService userQueryService;

    private static final long VIEWER = 1L;
    private static final long USER = 5L;
    private static final MemberId USER_ID = MemberId.of(USER);
    private static final MemberId VIEWER_ID = MemberId.of(VIEWER);

    @Test
    @DisplayName("getUserProfile: 조회자 제외 친구가 있으면 hasAcquaintances=true")
    void getUserProfile_hasAcquaintancesTrue() {
        when(memberRepository.findById(USER_ID)).thenReturn(Optional.of(member(USER, "user")));
        when(profileRepository.findByMemberId(USER_ID)).thenReturn(Optional.of(profile(USER, "소개")));
        when(friendshipRepository.countFriendsExcluding(USER_ID, VIEWER_ID)).thenReturn(2L);

        UserProfileResponse res = userQueryService.getUserProfile(VIEWER, USER);

        assertThat(res.userId()).isEqualTo(USER);
        assertThat(res.nickname()).isEqualTo("user");
        assertThat(res.introText()).isEqualTo("소개");
        assertThat(res.hasAcquaintances()).isTrue();
    }

    @Test
    @DisplayName("getUserProfile: 프로필 없으면 introText 빈 문자열, 친구 0이면 false")
    void getUserProfile_noProfile_false() {
        when(memberRepository.findById(USER_ID)).thenReturn(Optional.of(member(USER, "user")));
        when(profileRepository.findByMemberId(USER_ID)).thenReturn(Optional.empty());
        when(friendshipRepository.countFriendsExcluding(USER_ID, VIEWER_ID)).thenReturn(0L);

        UserProfileResponse res = userQueryService.getUserProfile(VIEWER, USER);

        assertThat(res.introText()).isEmpty();
        assertThat(res.hasAcquaintances()).isFalse();
    }

    @Test
    @DisplayName("getUserProfile: 회원이 없으면 MEMBER_NOT_FOUND")
    void getUserProfile_notFound() {
        when(memberRepository.findById(USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userQueryService.getUserProfile(VIEWER, USER))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Test
    @DisplayName("getAcquaintances: 조회자(viewer)는 결과에서 제외, hasAcquaintances 계산")
    void getAcquaintances_excludesViewer() {
        when(memberRepository.existsById(USER_ID)).thenReturn(true);
        when(friendshipRepository.findAllByMember(USER_ID)).thenReturn(List.of(
            Friendship.reconstitute(1L, MemberId.of(VIEWER), USER_ID),  // viewer → 제외
            Friendship.reconstitute(2L, USER_ID, MemberId.of(20L)),
            Friendship.reconstitute(3L, USER_ID, MemberId.of(21L))
        ));
        when(memberRepository.findAllByIds(anyList())).thenReturn(List.of(member(20L, "m20"), member(21L, "m21")));
        when(profileRepository.findAllByMemberIds(anyList()))
            .thenReturn(List.of(profile(20L, "m20 intro"), profile(21L, "m21 intro")));
        when(friendshipRepository.countFriendsExcluding(MemberId.of(20L), USER_ID)).thenReturn(1L);
        when(friendshipRepository.countFriendsExcluding(MemberId.of(21L), USER_ID)).thenReturn(0L);

        List<AcquaintanceResponse> result = userQueryService.getAcquaintances(VIEWER, USER);

        assertThat(result).extracting(AcquaintanceResponse::userId)
            .containsExactlyInAnyOrder(20L, 21L)
            .doesNotContain(VIEWER);
        AcquaintanceResponse a20 = result.stream().filter(a -> a.userId() == 20L).findFirst().orElseThrow();
        AcquaintanceResponse a21 = result.stream().filter(a -> a.userId() == 21L).findFirst().orElseThrow();
        assertThat(a20.hasAcquaintances()).isTrue();
        assertThat(a21.hasAcquaintances()).isFalse();
        assertThat(a20.bio()).isEqualTo("m20 intro");
    }

    @Test
    @DisplayName("getAcquaintances: 회원이 없으면 MEMBER_NOT_FOUND")
    void getAcquaintances_notFound() {
        when(memberRepository.existsById(USER_ID)).thenReturn(false);

        assertThatThrownBy(() -> userQueryService.getAcquaintances(VIEWER, USER))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    // ── fixtures ──
    private Member member(long id, String nickname) {
        return Member.reconstitute(MemberId.of(id), "kakao-" + id, Nickname.of(nickname),
            Gender.MALE, 1990, MemberStatus.ACTIVE, "KR");
    }

    private Profile profile(long memberId, String intro) {
        return Profile.reconstitute(MemberId.of(memberId), intro, null, Contact.reconstitute(null, null));
    }
}
