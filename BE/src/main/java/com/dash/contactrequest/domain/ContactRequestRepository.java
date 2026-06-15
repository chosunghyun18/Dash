package com.dash.contactrequest.domain;

import com.dash.member.domain.MemberId;

import java.util.List;
import java.util.Optional;

/** 연락 요청 저장소 포트 (도메인 소유). */
public interface ContactRequestRepository {

    ContactRequest save(ContactRequest request);

    Optional<ContactRequest> findById(Long id);

    boolean existsByRequesterAndTarget(MemberId requester, MemberId target);

    List<ContactRequest> findSentByRequester(MemberId requester);

    List<ContactRequest> findReceivedByTarget(MemberId target);
}
