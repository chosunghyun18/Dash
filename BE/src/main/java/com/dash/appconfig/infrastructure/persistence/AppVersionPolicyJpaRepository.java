package com.dash.appconfig.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

interface AppVersionPolicyJpaRepository extends JpaRepository<AppVersionPolicyJpaEntity, String> {
}
