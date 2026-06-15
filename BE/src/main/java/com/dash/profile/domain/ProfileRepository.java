package com.dash.profile.domain;

import com.dash.member.domain.MemberId;

import java.util.List;
import java.util.Optional;

/** 프로필 저장소 포트 (도메인 소유). */
public interface ProfileRepository {

    Profile save(Profile profile);

    Optional<Profile> findByMemberId(MemberId memberId);

    List<Profile> findAllByMemberIds(List<MemberId> memberIds);
}
