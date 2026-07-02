package com.dash.user.presentation;

import com.dash.user.application.UserQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "User", description = "유저 프로필·지인 탐색 API")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserQueryService userQueryService;

    @Operation(summary = "유저 프로필 조회", description = "특정 유저의 '나를 소개합니다' 프로필을 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "401", description = "인증 필요"),
        @ApiResponse(responseCode = "404", description = "회원 없음")
    })
    @SecurityRequirement(name = "BearerAuth")
    @GetMapping("/{userId}/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @AuthenticationPrincipal UserDetails user,
            @Parameter(description = "조회할 회원 id", example = "101") @PathVariable Long userId) {
        return ResponseEntity.ok(userQueryService.getUserProfile(memberId(user), userId));
    }

    @Operation(summary = "유저의 지인 목록 조회", description = "특정 유저의 지인(친구) 목록을 반환합니다. 조회자는 결과에서 제외됩니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "401", description = "인증 필요"),
        @ApiResponse(responseCode = "404", description = "회원 없음")
    })
    @SecurityRequirement(name = "BearerAuth")
    @GetMapping("/{userId}/acquaintances")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AcquaintanceResponse>> getAcquaintances(
            @AuthenticationPrincipal UserDetails user,
            @Parameter(description = "지인을 조회할 회원 id", example = "101") @PathVariable Long userId) {
        return ResponseEntity.ok(userQueryService.getAcquaintances(memberId(user), userId));
    }

    private Long memberId(UserDetails user) {
        return Long.parseLong(user.getUsername());
    }
}
