package com.dash.appconfig.domain;

import java.util.Optional;

/**
 * 앱 플랫폼. 클라이언트가 {@code X-Platform} 헤더로 전달하는 값과 매핑된다.
 */
public enum Platform {

    IOS("ios"),
    ANDROID("android");

    private final String code;

    Platform(String code) {
        this.code = code;
    }

    public String code() {
        return code;
    }

    /**
     * 헤더 문자열 → Platform. 대소문자 무시, 누락/미지원 값은 empty (fail-open 폴백은 호출부 책임).
     */
    public static Optional<Platform> from(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String normalized = raw.trim().toLowerCase();
        for (Platform platform : values()) {
            if (platform.code.equals(normalized)) {
                return Optional.of(platform);
            }
        }
        return Optional.empty();
    }
}
