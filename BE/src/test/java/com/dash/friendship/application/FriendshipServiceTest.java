package com.dash.friendship.application;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.domain.FriendshipRepository;
import com.dash.friendship.presentation.FriendResponse;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FriendshipServiceTest {

    @Mock FriendshipRepository friendshipRepository;
    @Mock MemberRepository memberRepository;
    @Mock ProfileRepository profileRepository;
    @InjectMocks FriendshipService friendshipService;

    private static final long ME = 1L;
    private static final MemberId ME_ID = MemberId.of(ME);

    @Test
    @DisplayName("getMyFriends: 상대 회원을 추출하고 bio=상대 introText 로 매핑")
    void getMyFriends_mapsOtherMemberAndBio() {
        when(friendshipRepository.findAllByMember(ME_ID)).thenReturn(List.of(
            Friendship.reconstitute(100L, MemberId.of(ME), MemberId.of(10L)),
            Friendship.reconstitute(200L, MemberId.of(ME), MemberId.of(2L))
        ));
        when(memberRepository.findAllByIds(anyList())).thenReturn(List.of(
            member(10L, "alice"), member(2L, "bob")
        ));
        when(profileRepository.findAllByMemberIds(anyList())).thenReturn(List.of(
            profile(10L, "alice intro"), profile(2L, "bob intro")
        ));

        List<FriendResponse> friends = friendshipService.getMyFriends(ME);

        assertThat(friends).hasSize(2);
        FriendResponse alice = friends.stream().filter(f -> f.userId() == 10L).findFirst().orElseThrow();
        assertThat(alice.id()).isEqualTo(100L);
        assertThat(alice.nickname()).isEqualTo("alice");
        assertThat(alice.bio()).isEqualTo("alice intro");
    }

    @Test
    @DisplayName("getMyFriends: 상대 프로필이 없으면 bio/profileImageUrl 은 null")
    void getMyFriends_missingProfile_nullBio() {
        when(friendshipRepository.findAllByMember(ME_ID)).thenReturn(List.of(
            Friendship.reconstitute(100L, MemberId.of(ME), MemberId.of(10L))
        ));
        when(memberRepository.findAllByIds(anyList())).thenReturn(List.of(member(10L, "alice")));
        when(profileRepository.findAllByMemberIds(anyList())).thenReturn(List.of());

        List<FriendResponse> friends = friendshipService.getMyFriends(ME);

        assertThat(friends).hasSize(1);
        assertThat(friends.get(0).bio()).isNull();
        assertThat(friends.get(0).profileImageUrl()).isNull();
    }

    @Test
    @DisplayName("getMyFriends: 친구가 없으면 빈 목록")
    void getMyFriends_empty() {
        when(friendshipRepository.findAllByMember(ME_ID)).thenReturn(List.of());
        when(memberRepository.findAllByIds(anyList())).thenReturn(List.of());
        when(profileRepository.findAllByMemberIds(anyList())).thenReturn(List.of());

        assertThat(friendshipService.getMyFriends(ME)).isEmpty();
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
