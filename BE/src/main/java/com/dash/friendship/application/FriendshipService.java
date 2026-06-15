package com.dash.friendship.application;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.domain.FriendshipRepository;
import com.dash.friendship.presentation.FriendResponse;
import com.dash.member.domain.Member;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import com.dash.profile.domain.Profile;
import com.dash.profile.domain.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;

    public List<FriendResponse> getMyFriends(Long memberId) {
        MemberId me = MemberId.of(memberId);
        List<Friendship> friendships = friendshipRepository.findAllByMember(me);

        List<MemberId> friendIds = friendships.stream().map(f -> f.other(me)).toList();
        Map<Long, Member> members = memberRepository.findAllByIds(friendIds).stream()
            .collect(Collectors.toMap(m -> m.getId().value(), Function.identity()));
        Map<Long, Profile> profiles = profileRepository.findAllByMemberIds(friendIds).stream()
            .collect(Collectors.toMap(p -> p.getMemberId().value(), Function.identity()));

        return friendships.stream()
            .map(f -> {
                Long friendId = f.other(me).value();
                return FriendResponse.of(f.getId(), members.get(friendId), profiles.get(friendId));
            })
            .toList();
    }
}
