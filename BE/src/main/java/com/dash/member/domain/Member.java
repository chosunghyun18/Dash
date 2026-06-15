package com.dash.member.domain;

import lombok.Getter;

/**
 * 회원 애그리거트 루트 (순수 도메인 — 프레임워크 의존 없음).
 * 식별자는 {@link MemberId}, 표시 이름은 {@link Nickname} VO 로 표현한다.
 * 영속 타임스탬프(createdAt/updatedAt)는 인프라(JpaEntity) 관심사이므로 도메인에 두지 않는다.
 */
@Getter
public class Member {

    private final MemberId id;        // 신규 생성 시 null
    private final String kakaoId;
    private Nickname nickname;
    private final Gender gender;
    private final Integer birthYear;
    private final MemberStatus status;
    private final String country;

    private Member(MemberId id, String kakaoId, Nickname nickname, Gender gender,
                   Integer birthYear, MemberStatus status, String country) {
        this.id = id;
        this.kakaoId = kakaoId;
        this.nickname = nickname;
        this.gender = gender;
        this.birthYear = birthYear;
        this.status = status;
        this.country = country;
    }

    /** 신규 회원 생성. */
    public static Member create(String kakaoId, Nickname nickname, Gender gender,
                                Integer birthYear, String country) {
        return new Member(null, kakaoId, nickname, gender, birthYear, MemberStatus.ACTIVE, country);
    }

    /** 영속 데이터로부터 복원. */
    public static Member reconstitute(MemberId id, String kakaoId, Nickname nickname, Gender gender,
                                      Integer birthYear, MemberStatus status, String country) {
        return new Member(id, kakaoId, nickname, gender, birthYear, status, country);
    }

    public void changeNickname(Nickname nickname) {
        this.nickname = nickname;
    }
}
