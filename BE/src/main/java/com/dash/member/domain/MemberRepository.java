package com.dash.member.domain;

import java.util.List;
import java.util.Optional;

/**
 * 회원 저장소 포트. 도메인이 소유하며 인프라(어댑터)가 구현한다.
 * Spring Data/JPA 타입을 노출하지 않고 도메인 객체/VO 만 주고받는다.
 */
public interface MemberRepository {

    Member save(Member member);

    Optional<Member> findById(MemberId id);

    Optional<Member> findByKakaoId(String kakaoId);

    List<Member> findAllByIds(List<MemberId> ids);

    boolean existsById(MemberId id);

    boolean existsByNicknameExcluding(Nickname nickname, MemberId excludeId);
}
