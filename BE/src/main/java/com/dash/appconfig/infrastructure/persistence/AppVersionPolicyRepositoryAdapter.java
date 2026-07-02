package com.dash.appconfig.infrastructure.persistence;

import com.dash.appconfig.domain.AppVersionPolicy;
import com.dash.appconfig.domain.AppVersionPolicyRepository;
import com.dash.appconfig.domain.Platform;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AppVersionPolicyRepositoryAdapter implements AppVersionPolicyRepository {

    private final AppVersionPolicyJpaRepository jpa;

    @Override
    public Optional<AppVersionPolicy> findByPlatform(Platform platform) {
        return jpa.findById(platform.code()).map(AppVersionPolicyMapper::toDomain);
    }
}
