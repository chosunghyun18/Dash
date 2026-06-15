package com.dash.user.service;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.repository.FriendshipRepository;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Gender;
import com.dash.member.domain.Member;
import com.dash.member.repository.MemberRepository;
import com.dash.profile.domain.Profile;
import com.dash.profile.repository.ProfileRepository;
import com.dash.user.dto.AcquaintanceResponse;
import com.dash.user.dto.UserProfileResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

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

    private static final Long VIEWER = 1L;
    private static final Long USER = 5L;

    @Test
    @DisplayName("getUserProfile: 조회자 제외 친구가 있으면 hasAcquaintances=true")
    void getUserProfile_hasAcquaintancesTrue() {
        when(memberRepository.findById(USER)).thenReturn(java.util.Optional.of(member(USER, "user")));
        when(profileRepository.findById(USER)).thenReturn(java.util.Optional.of(profile(USER, "소개")));
        when(friendshipRepository.countFriendsExcluding(USER, VIEWER)).thenReturn(2L);

        UserProfileResponse res = userQueryService.getUserProfile(VIEWER, USER);

        assertThat(res.userId()).isEqualTo(USER);
        assertThat(res.nickname()).isEqualTo("user");
        assertThat(res.introText()).isEqualTo("소개");
        assertThat(res.hasAcquaintances()).isTrue();
    }

    @Test
    @DisplayName("getUserProfile: 프로필 없으면 introText 빈 문자열, 친구 0이면 hasAcquaintances=false")
    void getUserProfile_noProfile_false() {
        when(memberRepository.findById(USER)).thenReturn(java.util.Optional.of(member(USER, "user")));
        when(profileRepository.findById(USER)).thenReturn(java.util.Optional.empty());
        when(friendshipRepository.countFriendsExcluding(USER, VIEWER)).thenReturn(0L);

        UserProfileResponse res = userQueryService.getUserProfile(VIEWER, USER);

        assertThat(res.introText()).isEmpty();
        assertThat(res.hasAcquaintances()).isFalse();
    }

    @Test
    @DisplayName("getUserProfile: 회원이 없으면 MEMBER_NOT_FOUND")
    void getUserProfile_notFound() {
        when(memberRepository.findById(USER)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> userQueryService.getUserProfile(VIEWER, USER))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Test
    @DisplayName("getAcquaintances: 조회자(viewer)는 결과에서 제외, hasAcquaintances 계산")
    void getAcquaintances_excludesViewer() {
        Member user = member(USER, "user");
        Member viewer = member(VIEWER, "viewer");
        Member m20 = member(20L, "m20");
        Member m21 = member(21L, "m21");

        when(memberRepository.existsById(USER)).thenReturn(true);
        when(friendshipRepository.findAllByMemberId(USER)).thenReturn(List.of(
            friendship(user, viewer),  // viewer → 제외 대상
            friendship(user, m20),
            friendship(user, m21)
        ));
        when(profileRepository.findAllById(anyList())).thenReturn(List.of(
            profile(20L, "m20 intro"), profile(21L, "m21 intro")
        ));
        when(friendshipRepository.countFriendsExcluding(20L, USER)).thenReturn(1L);  // 더 있음
        when(friendshipRepository.countFriendsExcluding(21L, USER)).thenReturn(0L);  // 없음

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
        when(memberRepository.existsById(USER)).thenReturn(false);

        assertThatThrownBy(() -> userQueryService.getAcquaintances(VIEWER, USER))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    // ── fixtures ──
    private Member member(Long id, String nickname) {
        Member m = Member.create("kakao-" + id, nickname, Gender.MALE, 1990, "KR");
        ReflectionTestUtils.setField(m, "id", id);
        return m;
    }

    private Friendship friendship(Member a, Member b) {
        return Friendship.create(a, b);
    }

    private Profile profile(Long memberId, String intro) {
        Profile p = Profile.empty(memberId);
        p.update(intro, null, null);
        return p;
    }
}
