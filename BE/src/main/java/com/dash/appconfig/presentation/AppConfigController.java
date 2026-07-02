package com.dash.appconfig.presentation;

import com.dash.appconfig.application.AppConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "AppConfig", description = "앱 버전 정책 API (인증 불필요)")
@RestController
@RequestMapping("/api/app-config")
@RequiredArgsConstructor
public class AppConfigController {

    private final AppConfigService appConfigService;

    @Operation(summary = "앱 버전 정책 조회",
        description = "X-App-Version / X-Platform 헤더로 업데이트 상태(OK/SOFT_UPDATE/FORCE_UPDATE)와 점검 여부를 반환합니다. "
            + "헤더 누락·판정 불가 시 OK로 폴백합니다(fail-open).")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping
    public ResponseEntity<AppConfigResponse> getAppConfig(
            @RequestHeader(value = "X-App-Version", required = false) String appVersion,
            @RequestHeader(value = "X-Platform", required = false) String platform) {
        return ResponseEntity.ok(appConfigService.resolve(appVersion, platform));
    }
}
