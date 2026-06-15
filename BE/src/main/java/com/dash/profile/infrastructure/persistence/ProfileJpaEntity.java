package com.dash.profile.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProfileJpaEntity {

    @Id
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "intro_text", nullable = false, columnDefinition = "TEXT")
    private String introText;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String email;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ProfileJpaEntity(Long memberId, String introText, String profileImageUrl,
                            String phone, String email) {
        this.memberId = memberId;
        this.introText = introText;
        this.profileImageUrl = profileImageUrl;
        this.phone = phone;
        this.email = email;
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        updatedAt = LocalDateTime.now();
    }
}
