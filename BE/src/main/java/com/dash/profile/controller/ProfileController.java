package com.dash.profile.controller;

import com.dash.profile.dto.MyProfileResponse;
import com.dash.profile.dto.NicknameCheckResponse;
import com.dash.profile.dto.UpdateProfileRequest;
import com.dash.profile.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Profile", description = "내 프로필 API")
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Validated
public class ProfileController {

    private final ProfileService profileService;

    @Operation(summary = "내 프로필 조회", description = "로그인한 회원의 프로필을 조회합니다. 프로필이 없으면 빈 프로필을 생성하여 반환합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "401", description = "인증 필요"),
        @ApiResponse(responseCode = "404", description = "회원 없음")
    })
    @SecurityRequirement(name = "BearerAuth")
    @GetMapping("/me/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MyProfileResponse> getMyProfile(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(profileService.getMyProfile(memberId(user)));
    }

    @Operation(summary = "내 프로필 수정", description = "닉네임, 소개글, 연락처(전화/이메일 중 하나)를 수정합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "수정 성공"),
        @ApiResponse(responseCode = "400", description = "검증 실패 / 연락처는 전화·이메일 중 하나만"),
        @ApiResponse(responseCode = "401", description = "인증 필요"),
        @ApiResponse(responseCode = "404", description = "회원 없음"),
        @ApiResponse(responseCode = "409", description = "닉네임 중복")
    })
    @SecurityRequirement(name = "BearerAuth")
    @PutMapping("/me/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MyProfileResponse> updateMyProfile(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateMyProfile(memberId(user), request));
    }

    @Operation(summary = "닉네임 중복 확인", description = "닉네임 사용 가능 여부를 반환합니다. 본인이 현재 사용 중인 닉네임은 사용 가능(true)으로 처리합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "확인 성공"),
        @ApiResponse(responseCode = "400", description = "닉네임 파라미터 검증 실패"),
        @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @SecurityRequirement(name = "BearerAuth")
    @GetMapping("/nickname-check")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NicknameCheckResponse> checkNickname(
            @AuthenticationPrincipal UserDetails user,
            @Parameter(description = "확인할 닉네임 (1~12자)", example = "dashuser")
            @RequestParam @NotBlank @Size(min = 1, max = 12) String nickname) {
        return ResponseEntity.ok(profileService.checkNickname(memberId(user), nickname));
    }

    private Long memberId(UserDetails user) {
        return Long.parseLong(user.getUsername());
    }
}
