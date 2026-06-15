package com.dash.user.dto;

import com.dash.member.domain.Member;
import com.dash.profile.domain.Profile;

public record UserProfileResponse(
    Long userId,
    String nickname,
    String profileImageUrl,
    String introText,
    boolean hasAcquaintances
) {
    public static UserProfileResponse of(Member member, Profile profile, boolean hasAcquaintances) {
        return new UserProfileResponse(
            member.getId(),
            member.getNickname(),
            profile != null ? profile.getProfileImageUrl() : null,
            profile != null ? profile.getIntroText() : "",
            hasAcquaintances
        );
    }
}
