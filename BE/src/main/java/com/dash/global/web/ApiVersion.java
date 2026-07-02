package com.dash.global.web;

/**
 * API 버전 협상 상수/파싱 유틸.
 * 클라이언트는 {@code X-API-Version} 헤더에 semver 문자열(예: "1.0.0")을 담아 보낸다.
 */
public final class ApiVersion {

    public static final String HEADER = "X-API-Version";
    public static final String CURRENT = "1.0.0";
    public static final int SUPPORTED_MAJOR = 1;

    private ApiVersion() {}

    /**
     * "1.0.0" → major 1. 누락(null/blank)은 폴백(SUPPORTED_MAJOR 반환). 파싱 실패 시 -1.
     */
    public static int majorOf(String header) {
        if (header == null || header.isBlank()) {
            return SUPPORTED_MAJOR; // 폴백 — 현재 버전으로 간주
        }
        try {
            return Integer.parseInt(header.trim().split("\\.")[0]);
        } catch (NumberFormatException e) {
            return -1;
        }
    }
}
