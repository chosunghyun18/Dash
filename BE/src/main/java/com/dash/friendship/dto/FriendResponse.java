package com.dash.friendship.dto;

import com.dash.member.domain.Member;
import com.dash.profile.domain.Profile;

public record FriendResponse(
    Long id,
    Long userId,
    String nickname,
    String profileImageUrl,
    String bio
) {
    public static FriendResponse of(Long friendshipId, Member friend, Profile profile) {
        return new FriendResponse(
            friendshipId,
            friend.getId(),
            friend.getNickname(),
            profile != null ? profile.getProfileImageUrl() : null,
            profile != null ? profile.getIntroText() : null
        );
    }
}
