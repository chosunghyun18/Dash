package com.dash.invitation.domain;

import java.util.UUID;

/** 초대 토큰 값 객체 — 12자 대문자 영숫자. */
public record InvitationToken(String value) {

    private static final int LENGTH = 12;

    public InvitationToken {
        if (value == null || value.length() != LENGTH) {
            throw new IllegalArgumentException("InvitationToken must be " + LENGTH + " characters: " + value);
        }
    }

    public static InvitationToken of(String value) {
        return new InvitationToken(value);
    }

    /** 새 토큰 생성 (유일성은 저장소에서 보장). */
    public static InvitationToken generate() {
        return new InvitationToken(
            UUID.randomUUID().toString().replace("-", "").substring(0, LENGTH).toUpperCase());
    }
}
