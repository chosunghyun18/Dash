package com.dash.auth.domain;

import java.util.Locale;

/**
 * 지원 소셜 로그인 제공자. 소셜 ID 는 기존 members.kakao_id(UNIQUE) 컬럼을 재사용하며
 * {@code "<provider>:<subject>"} 형식(예: {@code apple:001234.abcd})으로 저장한다.
 */
public enum SocialProvider {

    APPLE, GOOGLE;

    /** 소셜 ID 접두어 — "apple" / "google" (소문자). */
    public String prefix() {
        return name().toLowerCase(Locale.ROOT);
    }

    /** 저장용 소셜 ID 조립 — {@code "<provider>:<subject>"}. */
    public String socialId(String subject) {
        return prefix() + ":" + subject;
    }
}
