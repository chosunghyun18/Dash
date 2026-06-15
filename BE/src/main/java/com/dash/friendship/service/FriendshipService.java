package com.dash.friendship.service;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.dto.FriendResponse;
import com.dash.friendship.repository.FriendshipRepository;
import com.dash.member.domain.Member;
import com.dash.profile.domain.Profile;
import com.dash.profile.repository.ProfileRepository;
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
    private final ProfileRepository profileRepository;

    public List<FriendResponse> getMyFriends(Long memberId) {
        List<Friendship> friendships = friendshipRepository.findAllByMemberId(memberId);

        List<Long> friendIds = friendships.stream()
            .map(f -> other(f, memberId).getId())
            .toList();

        Map<Long, Profile> profiles = profileRepository.findAllById(friendIds).stream()
            .collect(Collectors.toMap(Profile::getMemberId, Function.identity()));

        return friendships.stream()
            .map(f -> {
                Member friend = other(f, memberId);
                return FriendResponse.of(f.getId(), friend, profiles.get(friend.getId()));
            })
            .toList();
    }

    /** 친구 관계에서 기준 회원(meId)이 아닌 상대 회원을 반환. */
    private Member other(Friendship friendship, Long meId) {
        return friendship.getMemberA().getId().equals(meId)
            ? friendship.getMemberB()
            : friendship.getMemberA();
    }
}
