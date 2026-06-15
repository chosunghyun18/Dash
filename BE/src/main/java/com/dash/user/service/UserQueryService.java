package com.dash.user.service;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.repository.FriendshipRepository;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Member;
import com.dash.member.repository.MemberRepository;
import com.dash.profile.domain.Profile;
import com.dash.profile.repository.ProfileRepository;
import com.dash.user.dto.AcquaintanceResponse;
import com.dash.user.dto.UserProfileResponse;
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
public class UserQueryService {

    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final FriendshipRepository friendshipRepository;

    /** 특정 유저의 "나를 소개합니다" 프로필 조회. hasAcquaintances 는 조회자(viewer)를 제외한 친구 보유 여부. */
    public UserProfileResponse getUserProfile(Long viewerId, Long userId) {
        Member member = memberRepository.findById(userId)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
        Profile profile = profileRepository.findById(userId).orElse(null);
        boolean hasAcquaintances = friendshipRepository.countFriendsExcluding(userId, viewerId) > 0;
        return UserProfileResponse.of(member, profile, hasAcquaintances);
    }

    /**
     * 특정 유저의 지인(친구) 목록 조회 (탐색 깊이 한 단계).
     * 조회해 온 노드(viewer)는 결과에서 제외하고, 각 지인의 hasAcquaintances 는
     * 해당 유저(userId)를 제외한 추가 친구 보유 여부로 계산한다.
     */
    public List<AcquaintanceResponse> getAcquaintances(Long viewerId, Long userId) {
        if (!memberRepository.existsById(userId)) {
            throw new BusinessException(ErrorCode.MEMBER_NOT_FOUND);
        }

        List<Member> acquaintances = friendshipRepository.findAllByMemberId(userId).stream()
            .map(f -> other(f, userId))
            .filter(m -> !m.getId().equals(viewerId))
            .toList();

        List<Long> ids = acquaintances.stream().map(Member::getId).toList();
        Map<Long, Profile> profiles = profileRepository.findAllById(ids).stream()
            .collect(Collectors.toMap(Profile::getMemberId, Function.identity()));

        return acquaintances.stream()
            .map(m -> {
                boolean hasMore = friendshipRepository.countFriendsExcluding(m.getId(), userId) > 0;
                return AcquaintanceResponse.of(m, profiles.get(m.getId()), hasMore);
            })
            .toList();
    }

    private Member other(Friendship friendship, Long meId) {
        return friendship.getMemberA().getId().equals(meId)
            ? friendship.getMemberB()
            : friendship.getMemberA();
    }
}
