package com.dash.member.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

interface MemberJpaRepository extends JpaRepository<MemberJpaEntity, Long> {

    Optional<MemberJpaEntity> findByKakaoId(String kakaoId);

    boolean existsByNicknameAndIdNot(String nickname, Long id);
}
