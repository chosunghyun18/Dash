package com.dash.contactrequest.controller;

import com.dash.contactrequest.dto.AcceptContactResponse;
import com.dash.contactrequest.dto.ContactRequestResponse;
import com.dash.contactrequest.dto.CreateContactRequestRequest;
import com.dash.contactrequest.dto.ReceivedContactRequestResponse;
import com.dash.contactrequest.service.ContactRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "ContactRequest", description = "연락 요청 API")
@RestController
@RequestMapping("/api/v1/contact-requests")
@RequiredArgsConstructor
public class ContactRequestController {

    private final ContactRequestService contactRequestService;

    @Operation(summary = "연락 요청 보내기", description = "대상 유저에게 연락처 공개 요청을 보냅니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "요청 생성 성공"),
        @ApiResponse(responseCode = "400", description = "자기 자신 요청 / 검증 실패"),
        @ApiResponse(responseCode = "401", description = "인증 필요"),
        @ApiResponse(responseCode = "404", description = "대상 회원 없음"),
        @ApiResponse(responseCode = "409", description = "이미 요청함")
    })
    @SecurityRequirement(name = "BearerAuth")
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ContactRequestResponse> create(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody CreateContactRequestRequest request) {
        return ResponseEntity.ok(contactRequestService.create(memberId(user), request.targetUserId()));
    }

    @Operation(summary = "보낸 연락 요청 목록", description = "내가 보낸 연락 요청 목록을 반환합니다. 수락된 건은 상대 연락처를 포함합니다.")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @SecurityRequirement(name = "BearerAuth")
    @GetMapping("/sent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ContactRequestResponse>> getSent(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(contactRequestService.getSent(memberId(user)));
    }

    @Operation(summary = "받은 연락 요청 목록", description = "내가 받은 연락 요청 목록을 반환합니다. 수락된 건은 상대 연락처를 포함합니다.")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @SecurityRequirement(name = "BearerAuth")
    @GetMapping("/received")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReceivedContactRequestResponse>> getReceived(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(contactRequestService.getReceived(memberId(user)));
    }

    @Operation(summary = "연락 요청 수락", description = "받은 연락 요청을 수락하고 상대 연락처를 반환합니다. 수신자만 호출 가능합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "수락 성공"),
        @ApiResponse(responseCode = "401", description = "인증 필요"),
        @ApiResponse(responseCode = "403", description = "권한 없음 (수신자 아님)"),
        @ApiResponse(responseCode = "404", description = "요청 없음"),
        @ApiResponse(responseCode = "409", description = "이미 처리된 요청")
    })
    @SecurityRequirement(name = "BearerAuth")
    @PostMapping("/{requestId}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AcceptContactResponse> accept(
            @AuthenticationPrincipal UserDetails user,
            @Parameter(description = "연락 요청 id", example = "1") @PathVariable Long requestId) {
        return ResponseEntity.ok(contactRequestService.accept(requestId, memberId(user)));
    }

    @Operation(summary = "연락 요청 거절", description = "받은 연락 요청을 거절합니다. 수신자만 호출 가능합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "거절 성공"),
        @ApiResponse(responseCode = "401", description = "인증 필요"),
        @ApiResponse(responseCode = "403", description = "권한 없음 (수신자 아님)"),
        @ApiResponse(responseCode = "404", description = "요청 없음"),
        @ApiResponse(responseCode = "409", description = "이미 처리된 요청")
    })
    @SecurityRequirement(name = "BearerAuth")
    @PostMapping("/{requestId}/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> reject(
            @AuthenticationPrincipal UserDetails user,
            @Parameter(description = "연락 요청 id", example = "1") @PathVariable Long requestId) {
        contactRequestService.reject(requestId, memberId(user));
        return ResponseEntity.ok().build();
    }

    private Long memberId(UserDetails user) {
        return Long.parseLong(user.getUsername());
    }
}
