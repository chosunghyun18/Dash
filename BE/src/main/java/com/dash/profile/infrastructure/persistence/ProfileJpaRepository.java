package com.dash.profile.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

interface ProfileJpaRepository extends JpaRepository<ProfileJpaEntity, Long> {
}
