package com.dash.invitation.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

interface InvitationJpaRepository extends JpaRepository<InvitationJpaEntity, Long> {

    Optional<InvitationJpaEntity> findByToken(String token);

    boolean existsByToken(String token);

    List<InvitationJpaEntity> findByInviterIdOrderByCreatedAtDesc(Long inviterId);
}
