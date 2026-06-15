package com.dash.friendship.presentation;

import com.dash.friendship.application.FriendshipService;
import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Friend", description = "친구 API")
@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    @Operation(summary = "내 친구 목록 조회", description = "로그인한 회원의 친구 목록을 반환합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @SecurityRequirement(name = "BearerAuth")
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FriendResponse>> getMyFriends(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(friendshipService.getMyFriends(memberId(user)));
    }

    private Long memberId(UserDetails user) {
        return Long.parseLong(user.getUsername());
    }
}
