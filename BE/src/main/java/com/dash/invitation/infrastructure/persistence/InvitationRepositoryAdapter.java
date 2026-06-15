package com.dash.invitation.infrastructure.persistence;

import com.dash.invitation.domain.Invitation;
import com.dash.invitation.domain.InvitationRepository;
import com.dash.invitation.domain.InvitationToken;
import com.dash.member.domain.MemberId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class InvitationRepositoryAdapter implements InvitationRepository {

    private final InvitationJpaRepository jpa;

    @Override
    public Invitation save(Invitation invitation) {
        return InvitationMapper.toDomain(jpa.save(InvitationMapper.toEntity(invitation)));
    }

    @Override
    public Optional<Invitation> findByToken(InvitationToken token) {
        return jpa.findByToken(token.value()).map(InvitationMapper::toDomain);
    }

    @Override
    public boolean existsByToken(InvitationToken token) {
        return jpa.existsByToken(token.value());
    }

    @Override
    public List<Invitation> findByInviterOrderByCreatedAtDesc(MemberId inviter) {
        return jpa.findByInviterIdOrderByCreatedAtDesc(inviter.value()).stream()
            .map(InvitationMapper::toDomain).toList();
    }
}
