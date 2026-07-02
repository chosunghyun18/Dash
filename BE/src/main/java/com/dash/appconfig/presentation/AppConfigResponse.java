package com.dash.appconfig.presentation;

/**
 * 앱 버전 정책 응답. status 는 {@code OK | SOFT_UPDATE | FORCE_UPDATE}.
 */
public record AppConfigResponse(
    String status,
    String latestVersion,
    String minSupportedVersion,
    String storeUrl,
    String message,
    boolean maintenance
) {
}
