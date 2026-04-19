package com.dash.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Member
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다"),

    // Invitation
    INVITATION_NOT_FOUND(HttpStatus.NOT_FOUND, "초대장을 찾을 수 없습니다"),
    INVITATION_EXPIRED(HttpStatus.GONE, "만료된 초대장입니다"),
    INVITATION_NOT_AVAILABLE(HttpStatus.CONFLICT, "사용할 수 없는 초대장입니다"),
    CANNOT_INVITE_SELF(HttpStatus.BAD_REQUEST, "자기 자신을 초대할 수 없습니다"),

    // Friendship
    ALREADY_FRIENDS(HttpStatus.CONFLICT, "이미 친구 관계입니다");

    private final HttpStatus status;
    private final String message;
}
