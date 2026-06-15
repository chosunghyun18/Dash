package com.dash.member.domain;

/**
 * 닉네임 값 객체. 1~12자(trim 후) 불변식을 캡슐화한다.
 * 사용자 입력은 표현 계층 Bean Validation 이 1차로 거르며, 이 VO 는 도메인 불변식의 최종 방어선이다.
 */
public record Nickname(String value) {

    private static final int MAX_LENGTH = 12;

    public Nickname {
        value = value == null ? null : value.trim();
        if (value == null || value.isEmpty() || value.length() > MAX_LENGTH) {
            throw new IllegalArgumentException("Nickname must be 1~" + MAX_LENGTH + " characters: " + value);
        }
    }

    public static Nickname of(String value) {
        return new Nickname(value);
    }
}
