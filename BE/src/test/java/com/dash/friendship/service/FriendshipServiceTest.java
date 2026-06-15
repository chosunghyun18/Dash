package com.dash.friendship.service;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.dto.FriendResponse;
import com.dash.friendship.repository.FriendshipRepository;
import com.dash.member.domain.Gender;
import com.dash.member.domain.Member;
import com.dash.profile.domain.Profile;
import com.dash.profile.repository.ProfileRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FriendshipServiceTest {

    @Mock FriendshipRepository friendshipRepository;
    @Mock ProfileRepository profileRepository;
    @InjectMocks FriendshipService friendshipService;

    private static final Long ME = 1L;

    @Test
    @DisplayName("getMyFriends: 양방향 관계에서 상대 회원을 추출하고 bio=상대 introText 로 매핑")
    void getMyFriends_mapsOtherMemberAndBio() {
        Member me = member(ME, "me");
        Member a = member(10L, "alice");   // me(1) < alice(10) → me=memberA
        Member b = member(2L, "bob");      // bob(2) < me(1)? no, me=1 < 2 → me=memberA

        Friendship f1 = friendship(100L, me, a);
        Friendship f2 = friendship(200L, b, me); // 정렬되어 memberA=me

        when(friendshipRepository.findAllByMemberId(ME)).thenReturn(List.of(f1, f2));
        when(profileRepository.findAllById(anyList())).thenReturn(List.of(
            profile(10L, "alice intro", null, null),
            profile(2L, "bob intro", null, null)
        ));

        List<FriendResponse> friends = friendshipService.getMyFriends(ME);

        assertThat(friends).hasSize(2);
        FriendResponse alice = friends.stream().filter(fr -> fr.userId() == 10L).findFirst().orElseThrow();
        assertThat(alice.id()).isEqualTo(100L);
        assertThat(alice.nickname()).isEqualTo("alice");
        assertThat(alice.bio()).isEqualTo("alice intro");
    }

    @Test
    @DisplayName("getMyFriends: 상대 프로필이 없으면 bio/profileImageUrl 은 null")
    void getMyFriends_missingProfile_nullBio() {
        Member me = member(ME, "me");
        Member a = member(10L, "alice");
        when(friendshipRepository.findAllByMemberId(ME)).thenReturn(List.of(friendship(100L, me, a)));
        when(profileRepository.findAllById(anyList())).thenReturn(List.of());

        List<FriendResponse> friends = friendshipService.getMyFriends(ME);

        assertThat(friends).hasSize(1);
        assertThat(friends.get(0).bio()).isNull();
        assertThat(friends.get(0).profileImageUrl()).isNull();
    }

    @Test
    @DisplayName("getMyFriends: 친구가 없으면 빈 목록")
    void getMyFriends_empty() {
        when(friendshipRepository.findAllByMemberId(ME)).thenReturn(List.of());
        when(profileRepository.findAllById(anyList())).thenReturn(List.of());

        assertThat(friendshipService.getMyFriends(ME)).isEmpty();
    }

    // ── fixtures ──
    private Member member(Long id, String nickname) {
        Member m = Member.create("kakao-" + id, nickname, Gender.MALE, 1990, "KR");
        ReflectionTestUtils.setField(m, "id", id);
        return m;
    }

    private Friendship friendship(Long id, Member a, Member b) {
        Friendship f = Friendship.create(a, b);
        ReflectionTestUtils.setField(f, "id", id);
        return f;
    }

    private Profile profile(Long memberId, String intro, String phone, String email) {
        Profile p = Profile.empty(memberId);
        p.update(intro, phone, email);
        return p;
    }
}
