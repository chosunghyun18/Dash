package com.dash.profile.infrastructure.persistence;

import com.dash.member.domain.MemberId;
import com.dash.profile.domain.Profile;
import com.dash.profile.domain.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ProfileRepositoryAdapter implements ProfileRepository {

    private final ProfileJpaRepository jpa;

    @Override
    public Profile save(Profile profile) {
        return ProfileMapper.toDomain(jpa.save(ProfileMapper.toEntity(profile)));
    }

    @Override
    public Optional<Profile> findByMemberId(MemberId memberId) {
        return jpa.findById(memberId.value()).map(ProfileMapper::toDomain);
    }

    @Override
    public List<Profile> findAllByMemberIds(List<MemberId> memberIds) {
        List<Long> rawIds = memberIds.stream().map(MemberId::value).toList();
        return jpa.findAllById(rawIds).stream().map(ProfileMapper::toDomain).toList();
    }
}
