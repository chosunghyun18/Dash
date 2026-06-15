package com.dash.contactrequest.domain;

import com.dash.member.domain.Member;
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
public class ContactRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private Member requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_id", nullable = false)
    private Member target;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContactRequestStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static ContactRequest create(Member requester, Member target) {
        ContactRequest request = new ContactRequest();
        request.requester = requester;
        request.target = target;
        request.status = ContactRequestStatus.PENDING;
        return request;
    }

    public void accept() {
        this.status = ContactRequestStatus.ACCEPTED;
    }

    public void reject() {
        this.status = ContactRequestStatus.REJECTED;
    }

    public boolean isPending() {
        return this.status == ContactRequestStatus.PENDING;
    }
}
