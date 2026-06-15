package com.dash.contactrequest.infrastructure.persistence;

import com.dash.contactrequest.domain.ContactRequestStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_requests",
    uniqueConstraints = @UniqueConstraint(columnNames = {"requester_id", "target_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ContactRequestJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "requester_id", nullable = false)
    private Long requesterId;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContactRequestStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ContactRequestJpaEntity(Long id, Long requesterId, Long targetId,
                                   ContactRequestStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.requesterId = requesterId;
        this.targetId = targetId;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
