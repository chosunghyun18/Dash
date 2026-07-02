package com.dash.appconfig.application;

import com.dash.appconfig.domain.AppVersionPolicy;
import com.dash.appconfig.domain.AppVersionPolicyRepository;
import com.dash.appconfig.domain.Platform;
import com.dash.appconfig.domain.UpdateStatus;
import com.dash.appconfig.presentation.AppConfigResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AppConfigService {

    private final AppVersionPolicyRepository appVersionPolicyRepository;

    /**
     * 앱 버전/플랫폼 헤더로 업데이트 상태를 판정한다.
     * 플랫폼 누락·미지원, 정책 미존재 등 판정 불가 상황은 모두 OK 폴백(fail-open) —
     * 서버 정책 문제로 앱 진입이 막히지 않게 한다.
     */
    @Transactional(readOnly = true)
    public AppConfigResponse resolve(String appVersion, String platformHeader) {
        return Platform.from(platformHeader)
            .flatMap(appVersionPolicyRepository::findByPlatform)
            .map(policy -> toResponse(policy, appVersion))
            .orElseGet(() -> fallback(appVersion));
    }

    private AppConfigResponse toResponse(AppVersionPolicy policy, String appVersion) {
        UpdateStatus status = policy.evaluate(appVersion);
        return new AppConfigResponse(
            status.name(),
            policy.getLatestVersion(),
            policy.getMinSupportedVersion(),
            policy.getStoreUrl(),
            policy.getMessage(),
            policy.isMaintenance()
        );
    }

    /** 정책 조회 불가 시 OK·maintenance=false 폴백 응답(fail-open). */
    private AppConfigResponse fallback(String appVersion) {
        String version = appVersion == null ? "" : appVersion;
        return new AppConfigResponse(UpdateStatus.OK.name(), version, version, "", "", false);
    }
}
