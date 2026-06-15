package com.dash.profile.dto;

import com.dash.member.domain.Member;
import com.dash.profile.domain.Profile;

public record MyProfileResponse(
    String nickname,
    String phone,
    String email,
    String introText
) {
    public static MyProfileResponse of(Member member, Profile profile) {
        return new MyProfileResponse(
            member.getNickname(),
            profile.getPhone(),
            profile.getEmail(),
            profile.getIntroText()
        );
    }
}
