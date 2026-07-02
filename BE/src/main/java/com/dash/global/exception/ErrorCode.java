package com.dash.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Auth
    INVALID_SOCIAL_TOKEN(HttpStatus.BAD_REQUEST, "유효하지 않은 소셜 토큰입니다"),

    // Member
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다"),

    // Invitation
    INVITATION_NOT_FOUND(HttpStatus.NOT_FOUND, "초대장을 찾을 수 없습니다"),
    INVITATION_EXPIRED(HttpStatus.GONE, "만료된 초대장입니다"),
    INVITATION_NOT_AVAILABLE(HttpStatus.CONFLICT, "사용할 수 없는 초대장입니다"),
    CANNOT_INVITE_SELF(HttpStatus.BAD_REQUEST, "자기 자신을 초대할 수 없습니다"),

    // Friendship
    ALREADY_FRIENDS(HttpStatus.CONFLICT, "이미 친구 관계입니다"),

    // Profile
    NICKNAME_DUPLICATED(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다"),
    INVALID_CONTACT(HttpStatus.BAD_REQUEST, "연락처(전화 또는 이메일) 중 하나만 입력해야 합니다"),

    // Contact Request
    CONTACT_REQUEST_NOT_FOUND(HttpStatus.NOT_FOUND, "연락 요청을 찾을 수 없습니다"),
    CONTACT_REQUEST_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 연락 요청을 보냈습니다"),
    CONTACT_REQUEST_NOT_PENDING(HttpStatus.CONFLICT, "이미 처리된 연락 요청입니다"),
    CONTACT_REQUEST_FORBIDDEN(HttpStatus.FORBIDDEN, "해당 연락 요청에 대한 권한이 없습니다"),
    CANNOT_REQUEST_SELF(HttpStatus.BAD_REQUEST, "자기 자신에게 연락 요청할 수 없습니다"),

    // API
    UNSUPPORTED_API_VERSION(HttpStatus.BAD_REQUEST, "지원하지 않는 API 버전입니다");

    private final HttpStatus status;
    private final String message;
}
