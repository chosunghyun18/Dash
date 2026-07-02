package com.dash.appconfig.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "app_version_policy")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AppVersionPolicyJpaEntity {

    @Id
    @Column(length = 10)
    private String platform;

    @Column(nullable = false, length = 20)
    private String minSupportedVersion;

    @Column(nullable = false, length = 20)
    private String latestVersion;

    @Column(nullable = false, length = 500)
    private String storeUrl;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private boolean maintenance;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
