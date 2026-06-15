package com.dash.contactrequest.repository;

import com.dash.contactrequest.domain.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {

    boolean existsByRequesterIdAndTargetId(Long requesterId, Long targetId);

    @Query("SELECT cr FROM ContactRequest cr JOIN FETCH cr.target " +
           "WHERE cr.requester.id = :requesterId ORDER BY cr.createdAt DESC")
    List<ContactRequest> findSentByRequesterId(@Param("requesterId") Long requesterId);

    @Query("SELECT cr FROM ContactRequest cr JOIN FETCH cr.requester " +
           "WHERE cr.target.id = :targetId ORDER BY cr.createdAt DESC")
    List<ContactRequest> findReceivedByTargetId(@Param("targetId") Long targetId);
}
