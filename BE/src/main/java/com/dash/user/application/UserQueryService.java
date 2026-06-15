package com.dash.user.application;

import com.dash.friendship.domain.FriendshipRepository;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Member;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import com.dash.profile.domain.Profile;
import com.dash.profile.domain.ProfileRepository;
import com.dash.user.presentation.AcquaintanceResponse;
import com.dash.user.presentation.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 유저 프로필·지인 조회 (CQRS read 측). member/profile/friendship 세 컨텍스트의
 * 읽기 포트만 조합해 read view 를 조립한다. 쓰기 도메인 애그리거트를 만들지 않는다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserQueryService {

    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final FriendshipRepository friendshipRepository;

    /** 특정 유저의 프로필 조회. hasAcquaintances 는 조회자(viewer)를 제외한 친구 보유 여부. */
    public UserProfileResponse getUserProfile(Long viewerId, Long userId) {
        MemberId user = MemberId.of(userId);
        Member member = memberRepository.findById(user)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
        Profile profile = profileRepository.findByMemberId(user).orElse(null);
        boolean hasAcquaintances = friendshipRepository.countFriendsExcluding(user, MemberId.of(viewerId)) > 0;
        return UserProfileResponse.of(member, profile, hasAcquaintances);
    }

    /**
     * 특정 유저의 지인 목록 (탐색 한 단계). 조회자(viewer)는 제외하고,
     * 각 지인의 hasAcquaintances 는 해당 유저(userId)를 제외한 추가 친구 보유 여부로 계산한다.
     */
    public List<AcquaintanceResponse> getAcquaintances(Long viewerId, Long userId) {
        MemberId user = MemberId.of(userId);
        MemberId viewer = MemberId.of(viewerId);
        if (!memberRepository.existsById(user)) {
            throw new BusinessException(ErrorCode.MEMBER_NOT_FOUND);
        }

        List<MemberId> acquaintanceIds = friendshipRepository.findAllByMember(user).stream()
            .map(f -> f.other(user))
            .filter(id -> !id.equals(viewer))
            .toList();

        Map<Long, Member> members = memberRepository.findAllByIds(acquaintanceIds).stream()
            .collect(Collectors.toMap(m -> m.getId().value(), Function.identity()));
        Map<Long, Profile> profiles = profileRepository.findAllByMemberIds(acquaintanceIds).stream()
            .collect(Collectors.toMap(p -> p.getMemberId().value(), Function.identity()));

        return acquaintanceIds.stream()
            .map(id -> {
                boolean hasMore = friendshipRepository.countFriendsExcluding(id, user) > 0;
                return AcquaintanceResponse.of(members.get(id.value()), profiles.get(id.value()), hasMore);
            })
            .toList();
    }
}
