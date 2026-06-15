package com.dash.member.domain;

/**
 * 회원 식별자 값 객체. 컨텍스트 간 회원 참조의 중심이며,
 * 친구 관계 정렬(member_a_id < member_b_id) 불변식에 사용된다.
 */
public record MemberId(Long value) implements Comparable<MemberId> {

    public MemberId {
        if (value == null) {
            throw new IllegalArgumentException("MemberId value must not be null");
        }
    }

    public static MemberId of(Long value) {
        return new MemberId(value);
    }

    @Override
    public int compareTo(MemberId other) {
        return Long.compare(this.value, other.value);
    }
}
