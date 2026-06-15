package com.dash.contactrequest.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

interface ContactRequestJpaRepository extends JpaRepository<ContactRequestJpaEntity, Long> {

    boolean existsByRequesterIdAndTargetId(Long requesterId, Long targetId);

    List<ContactRequestJpaEntity> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);

    List<ContactRequestJpaEntity> findByTargetIdOrderByCreatedAtDesc(Long targetId);
}
