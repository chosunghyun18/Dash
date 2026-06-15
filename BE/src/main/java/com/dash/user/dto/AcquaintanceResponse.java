package com.dash.user.dto;

import com.dash.member.domain.Member;
import com.dash.profile.domain.Profile;

public record AcquaintanceResponse(
    Long id,
    Long userId,
    String nickname,
    String profileImageUrl,
    boolean hasAcquaintances,
    String bio
) {
    public static AcquaintanceResponse of(Member member, Profile profile, boolean hasAcquaintances) {
        return new AcquaintanceResponse(
            member.getId(),
            member.getId(),
            member.getNickname(),
            profile != null ? profile.getProfileImageUrl() : null,
            hasAcquaintances,
            profile != null ? profile.getIntroText() : null
        );
    }
}
