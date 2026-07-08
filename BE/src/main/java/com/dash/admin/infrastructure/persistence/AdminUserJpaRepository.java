package com.dash.admin.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

interface AdminUserJpaRepository extends JpaRepository<AdminUserJpaEntity, Long> {

    Optional<AdminUserJpaEntity> findByLoginId(String loginId);
}
