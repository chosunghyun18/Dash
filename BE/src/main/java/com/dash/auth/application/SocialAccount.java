package com.dash.auth.application;

import com.dash.auth.domain.SocialProvider;

/** 소셜 토큰 검증 결과 — 제공자별 고유 subject 와 (있다면) 이메일. */
public record SocialAccount(SocialProvider provider, String subject, String email) {
}
