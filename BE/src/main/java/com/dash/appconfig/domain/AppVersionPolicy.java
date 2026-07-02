package com.dash.appconfig.domain;

import lombok.Getter;

import java.util.Optional;

/**
 * 플랫폼별 앱 버전 정책 (순수 도메인 — 프레임워크 의존 없음).
 * DB에서 관리되며, 클라이언트 앱 버전과 비교해 업데이트 상태를 판정한다.
 * 영속 타임스탬프(updatedAt)는 인프라(JpaEntity) 관심사이므로 도메인에 두지 않는다.
 */
@Getter
public class AppVersionPolicy {

    private final Platform platform;
    private final String minSupportedVersion;
    private final String latestVersion;
    private final String storeUrl;
    private final String message;
    private final boolean maintenance;

    private AppVersionPolicy(Platform platform, String minSupportedVersion, String latestVersion,
                             String storeUrl, String message, boolean maintenance) {
        this.platform = platform;
        this.minSupportedVersion = minSupportedVersion;
        this.latestVersion = latestVersion;
        this.storeUrl = storeUrl;
        this.message = message;
        this.maintenance = maintenance;
    }

    /** 영속 데이터로부터 복원. */
    public static AppVersionPolicy reconstitute(Platform platform, String minSupportedVersion,
                                                String latestVersion, String storeUrl,
                                                String message, boolean maintenance) {
        return new AppVersionPolicy(platform, minSupportedVersion, latestVersion, storeUrl, message, maintenance);
    }

    /**
     * 앱 버전 판정: appVersion &lt; min → FORCE_UPDATE, &lt; latest → SOFT_UPDATE, else OK.
     * appVersion 파싱 실패(누락/비정상 형식)는 OK로 폴백한다(fail-open).
     */
    public UpdateStatus evaluate(String appVersion) {
        Optional<SemVer> current = SemVer.parse(appVersion);
        if (current.isEmpty()) {
            return UpdateStatus.OK; // fail-open: 판정 불가 시 진입 허용
        }
        Optional<SemVer> min = SemVer.parse(minSupportedVersion);
        if (min.isPresent() && current.get().isLowerThan(min.get())) {
            return UpdateStatus.FORCE_UPDATE;
        }
        Optional<SemVer> latest = SemVer.parse(latestVersion);
        if (latest.isPresent() && current.get().isLowerThan(latest.get())) {
            return UpdateStatus.SOFT_UPDATE;
        }
        return UpdateStatus.OK;
    }
}
