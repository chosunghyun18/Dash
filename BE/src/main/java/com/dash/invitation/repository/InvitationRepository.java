package com.dash.invitation.repository;

import com.dash.invitation.domain.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    Optional<Invitation> findByToken(String token);

    @Query("SELECT i FROM Invitation i JOIN FETCH i.inviter WHERE i.token = :token")
    Optional<Invitation> findByTokenWithInviter(@Param("token") String token);

    boolean existsByToken(String token);

    List<Invitation> findByInviterIdOrderByCreatedAtDesc(Long inviterId);
}
