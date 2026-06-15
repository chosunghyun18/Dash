package com.dash.invitation.domain;

import com.dash.member.domain.MemberId;

import java.util.List;
import java.util.Optional;

/** 초대 저장소 포트 (도메인 소유). */
public interface InvitationRepository {

    Invitation save(Invitation invitation);

    Optional<Invitation> findByToken(InvitationToken token);

    boolean existsByToken(InvitationToken token);

    List<Invitation> findByInviterOrderByCreatedAtDesc(MemberId inviter);
}
