package com.dash.invitation.controller;

import com.dash.invitation.dto.InvitationAcceptResponse;
import com.dash.invitation.dto.InvitationCreateResponse;
import com.dash.invitation.dto.InvitationSummary;
import com.dash.invitation.dto.InvitationValidateResponse;
import com.dash.invitation.service.InvitationService;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Invitation", description = "친구 초대 API")
@RestController
@RequestMapping("/api/v1/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    @Operation(summary = "초대 링크 생성", description = "나라별 메신저 공유용 초대 토큰과 URL을 생성합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "생성 성공"),
        @ApiResponse(responseCode = "401", description = "인증 필요"),
        @ApiResponse(responseCode = "404", description = "회원 없음")
    })
    @SecurityRequirement(name = "BearerAuth")
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InvitationCreateResponse> create(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(invitationService.create(memberId(user)));
    }

    @Operation(summary = "초대 토큰 유효성 확인", description = "딥링크 진입 시 토큰을 검증하고 초대자 정보를 반환합니다. 인증 불필요.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "유효한 초대"),
        @ApiResponse(responseCode = "404", description = "토큰 없음"),
        @ApiResponse(responseCode = "409", description = "이미 사용됐거나 취소된 초대"),
        @ApiResponse(responseCode = "410", description = "만료된 초대")
    })
    @GetMapping("/validate/{token}")
    public ResponseEntity<InvitationValidateResponse> validate(
            @Parameter(description = "초대 토큰 (12자)", example = "A1B2C3D4E5F6") @PathVariable String token) {
        return ResponseEntity.ok(invitationService.validate(token));
    }

    @Operation(summary = "초대 수락", description = "초대를 수락하고 친구 관계를 생성합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "수락 성공 — Friendship 생성됨"),
        @ApiResponse(responseCode = "400", description = "자기 자신 초대"),
        @ApiResponse(responseCode = "401", description = "인증 필요"),
        @ApiResponse(responseCode = "404", description = "토큰 또는 회원 없음"),
        @ApiResponse(responseCode = "409", description = "이미 친구 / 사용 불가 초대"),
        @ApiResponse(responseCode = "410", description = "만료된 초대")
    })
    @SecurityRequirement(name = "BearerAuth")
    @PostMapping("/{token}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InvitationAcceptResponse> accept(
            @Parameter(description = "초대 토큰 (12자)", example = "A1B2C3D4E5F6") @PathVariable String token,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(invitationService.accept(token, memberId(user)));
    }

    @Operation(summary = "내 초대 목록 조회", description = "내가 보낸 초대 내역과 상태를 반환합니다.")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @SecurityRequirement(name = "BearerAuth")
    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<InvitationSummary>> getMyInvitations(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(invitationService.getMyInvitations(memberId(user)));
    }

    private Long memberId(UserDetails user) {
        return Long.parseLong(user.getUsername());
    }
}
