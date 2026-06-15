package com.dash.profile.domain;

import com.dash.member.domain.MemberId;
import lombok.Getter;

/**
 * 프로필 애그리거트 루트 (순수 도메인). members 와 공유 PK(memberId)지만 별도 애그리거트로,
 * 회원 생성과 독립적으로 lazy 생성({@link #empty})될 수 있다.
 */
@Getter
public class Profile {

    private final MemberId memberId;
    private String introText;
    private String profileImageUrl;
    private Contact contact;   // nullable — 빈 프로필은 연락처 없음

    private Profile(MemberId memberId, String introText, String profileImageUrl, Contact contact) {
        this.memberId = memberId;
        this.introText = introText;
        this.profileImageUrl = profileImageUrl;
        this.contact = contact;
    }

    /** 빈 프로필 생성 (회원은 있으나 프로필 row 가 없을 때). */
    public static Profile empty(MemberId memberId) {
        return new Profile(memberId, "", null, null);
    }

    public static Profile reconstitute(MemberId memberId, String introText, String profileImageUrl, Contact contact) {
        return new Profile(memberId, introText, profileImageUrl, contact);
    }

    public void update(String introText, Contact contact) {
        this.introText = introText;
        this.contact = contact;
    }

    public String getPhone() {
        return contact != null ? contact.phone() : null;
    }

    public String getEmail() {
        return contact != null ? contact.email() : null;
    }
}
