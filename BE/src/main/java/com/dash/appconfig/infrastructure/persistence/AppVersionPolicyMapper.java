package com.dash.appconfig.infrastructure.persistence;

import com.dash.appconfig.domain.AppVersionPolicy;
import com.dash.appconfig.domain.Platform;

final class AppVersionPolicyMapper {

    private AppVersionPolicyMapper() {
    }

    static AppVersionPolicy toDomain(AppVersionPolicyJpaEntity e) {
        return AppVersionPolicy.reconstitute(
            Platform.from(e.getPlatform()).orElseThrow(
                () -> new IllegalStateException("지원하지 않는 platform 값: " + e.getPlatform())),
            e.getMinSupportedVersion(),
            e.getLatestVersion(),
            e.getStoreUrl(),
            e.getMessage(),
            e.isMaintenance()
        );
    }
}
