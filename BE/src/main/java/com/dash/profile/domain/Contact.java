package com.dash.profile.domain;

import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;

/**
 * 연락처 값 객체 — phone / email 중 정확히 하나만 보유한다는 불변식을 캡슐화한다.
 * 빈 문자열/공백은 null 로 정규화한다.
 */
public record Contact(String phone, String email) {

    /** 사용자 입력으로부터 생성 — XOR 불변식 강제 (위반 시 INVALID_CONTACT). */
    public static Contact of(String phone, String email) {
        String p = normalize(phone);
        String e = normalize(email);
        if ((p != null) == (e != null)) {
            throw new BusinessException(ErrorCode.INVALID_CONTACT);
        }
        return new Contact(p, e);
    }

    /** 영속 데이터로부터 복원 — 불변식 검증 없이 정규화만 (DB 신뢰). null/null 가능. */
    public static Contact reconstitute(String phone, String email) {
        return new Contact(normalize(phone), normalize(email));
    }

    public boolean isEmpty() {
        return phone == null && email == null;
    }

    private static String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}
