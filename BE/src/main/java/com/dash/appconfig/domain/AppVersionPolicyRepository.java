package com.dash.appconfig.domain;

import java.util.Optional;

/**
 * 앱 버전 정책 저장소 포트. 도메인이 소유하며 인프라(어댑터)가 구현한다.
 * Spring Data/JPA 타입을 노출하지 않고 도메인 객체만 주고받는다.
 */
public interface AppVersionPolicyRepository {

    Optional<AppVersionPolicy> findByPlatform(Platform platform);
}
