package com.dash.profile.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * 내 프로필 수정 요청.
 *
 * <p>phone / email 은 둘 중 정확히 하나만 입력해야 한다 (XOR). 이 교차 검증은
 * 빈 문자열 정규화가 필요하므로 Bean Validation 이 아닌 {@code ProfileService} 에서 수행한다.
 */
public record UpdateProfileRequest(

    @NotBlank
    @Size(min = 1, max = 12, message = "닉네임은 1~12자여야 합니다")
    String nickname,

    @NotNull(message = "소개글은 null 일 수 없습니다")
    @Size(max = 500, message = "소개글은 500자 이하여야 합니다")
    String introText,

    @Size(max = 20)
    @Pattern(regexp = "^[0-9+\\-]*$", message = "전화번호 형식이 올바르지 않습니다")
    String phone,

    @Email(message = "이메일 형식이 올바르지 않습니다")
    @Size(max = 255)
    String email
) {
}
