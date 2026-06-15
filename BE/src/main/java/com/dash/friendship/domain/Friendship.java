package com.dash.friendship.domain;

import com.dash.member.domain.MemberId;
import lombok.Getter;

/**
 * 친구 관계 애그리거트 루트 (순수 도메인). 무방향 관계를 단일 레코드로 표현하며,
 * memberA < memberB 정렬 불변식으로 양방향 중복을 방지한다.
 */
@Getter
public class Friendship {

    private final Long id;          // 신규 생성 시 null
    private final MemberId memberA; // 항상 더 작은 id
    private final MemberId memberB; // 항상 더 큰 id

    private Friendship(Long id, MemberId memberA, MemberId memberB) {
        this.id = id;
        this.memberA = memberA;
        this.memberB = memberB;
    }

    /** 두 회원으로 친구 관계 생성 — id 순서로 정렬하여 불변식 보장. */
    public static Friendship create(MemberId a, MemberId b) {
        return a.compareTo(b) <= 0 ? new Friendship(null, a, b) : new Friendship(null, b, a);
    }

    public static Friendship reconstitute(Long id, MemberId memberA, MemberId memberB) {
        return new Friendship(id, memberA, memberB);
    }

    /** 관계에서 기준 회원이 아닌 상대 회원. */
    public MemberId other(MemberId me) {
        return memberA.equals(me) ? memberB : memberA;
    }
}
