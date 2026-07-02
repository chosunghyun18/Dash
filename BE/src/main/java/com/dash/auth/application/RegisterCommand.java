package com.dash.auth.application;

import com.dash.member.domain.Gender;

/** 신규 회원 등록 커맨드 — 등록 토큰과 함께 {@code /auth/register} 로 전달되는 프로필 정보. */
public record RegisterCommand(
    String nickname,
    Gender gender,
    Integer birthYear,
    String phone,
    String email,
    String introText
) {
}
