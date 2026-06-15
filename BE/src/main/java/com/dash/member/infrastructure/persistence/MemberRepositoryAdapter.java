package com.dash.member.infrastructure.persistence;

import com.dash.member.domain.Member;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import com.dash.member.domain.Nickname;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MemberRepositoryAdapter implements MemberRepository {

    private final MemberJpaRepository jpa;

    @Override
    public Member save(Member member) {
        return MemberMapper.toDomain(jpa.save(MemberMapper.toEntity(member)));
    }

    @Override
    public Optional<Member> findById(MemberId id) {
        return jpa.findById(id.value()).map(MemberMapper::toDomain);
    }

    @Override
    public Optional<Member> findByKakaoId(String kakaoId) {
        return jpa.findByKakaoId(kakaoId).map(MemberMapper::toDomain);
    }

    @Override
    public List<Member> findAllByIds(List<MemberId> ids) {
        List<Long> rawIds = ids.stream().map(MemberId::value).toList();
        return jpa.findAllById(rawIds).stream().map(MemberMapper::toDomain).toList();
    }

    @Override
    public boolean existsById(MemberId id) {
        return jpa.existsById(id.value());
    }

    @Override
    public boolean existsByNicknameExcluding(Nickname nickname, MemberId excludeId) {
        return jpa.existsByNicknameAndIdNot(nickname.value(), excludeId.value());
    }
}
