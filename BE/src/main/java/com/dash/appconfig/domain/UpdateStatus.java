package com.dash.appconfig.domain;

/**
 * 앱 버전 판정 결과.
 * <ul>
 *   <li>{@link #FORCE_UPDATE} — 최소 지원 버전 미만, 업데이트 전까지 차단</li>
 *   <li>{@link #SOFT_UPDATE} — 최신 버전 미만, 업데이트 권장(닫기 가능)</li>
 *   <li>{@link #OK} — 정상 진행</li>
 * </ul>
 */
public enum UpdateStatus {
    OK,
    SOFT_UPDATE,
    FORCE_UPDATE
}
