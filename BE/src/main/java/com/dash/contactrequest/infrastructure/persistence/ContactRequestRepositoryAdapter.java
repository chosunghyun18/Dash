package com.dash.contactrequest.infrastructure.persistence;

import com.dash.contactrequest.domain.ContactRequest;
import com.dash.contactrequest.domain.ContactRequestRepository;
import com.dash.member.domain.MemberId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ContactRequestRepositoryAdapter implements ContactRequestRepository {

    private final ContactRequestJpaRepository jpa;

    @Override
    public ContactRequest save(ContactRequest request) {
        return ContactRequestMapper.toDomain(jpa.save(ContactRequestMapper.toEntity(request)));
    }

    @Override
    public Optional<ContactRequest> findById(Long id) {
        return jpa.findById(id).map(ContactRequestMapper::toDomain);
    }

    @Override
    public boolean existsByRequesterAndTarget(MemberId requester, MemberId target) {
        return jpa.existsByRequesterIdAndTargetId(requester.value(), target.value());
    }

    @Override
    public List<ContactRequest> findSentByRequester(MemberId requester) {
        return jpa.findByRequesterIdOrderByCreatedAtDesc(requester.value()).stream()
            .map(ContactRequestMapper::toDomain).toList();
    }

    @Override
    public List<ContactRequest> findReceivedByTarget(MemberId target) {
        return jpa.findByTargetIdOrderByCreatedAtDesc(target.value()).stream()
            .map(ContactRequestMapper::toDomain).toList();
    }
}
