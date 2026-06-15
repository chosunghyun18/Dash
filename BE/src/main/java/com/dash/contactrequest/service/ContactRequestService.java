package com.dash.contactrequest.service;

import com.dash.contactrequest.domain.ContactRequest;
import com.dash.contactrequest.dto.AcceptContactResponse;
import com.dash.contactrequest.dto.ContactRequestResponse;
import com.dash.contactrequest.dto.ReceivedContactRequestResponse;
import com.dash.contactrequest.repository.ContactRequestRepository;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Member;
import com.dash.member.repository.MemberRepository;
import com.dash.profile.domain.Profile;
import com.dash.profile.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContactRequestService {

    private final ContactRequestRepository contactRequestRepository;
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;

    @Transactional
    public ContactRequestResponse create(Long requesterId, Long targetUserId) {
        if (requesterId.equals(targetUserId)) {
            throw new BusinessException(ErrorCode.CANNOT_REQUEST_SELF);
        }
        Member target = memberRepository.findById(targetUserId)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
        Member requester = memberRepository.findById(requesterId)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        if (contactRequestRepository.existsByRequesterIdAndTargetId(requesterId, targetUserId)) {
            throw new BusinessException(ErrorCode.CONTACT_REQUEST_ALREADY_EXISTS);
        }

        ContactRequest saved = contactRequestRepository.save(ContactRequest.create(requester, target));
        // 생성 직후엔 PENDING 이므로 연락처는 노출되지 않음.
        return ContactRequestResponse.of(saved, null, null);
    }

    /** 보낸 요청 목록 — ACCEPTED 건은 상대(target) 연락처 포함. */
    public List<ContactRequestResponse> getSent(Long requesterId) {
        List<ContactRequest> requests = contactRequestRepository.findSentByRequesterId(requesterId);
        Map<Long, Profile> profiles = loadProfiles(requests.stream()
            .map(cr -> cr.getTarget().getId()).toList());

        return requests.stream()
            .map(cr -> {
                Profile p = profiles.get(cr.getTarget().getId());
                return ContactRequestResponse.of(cr, phone(p), email(p));
            })
            .toList();
    }

    /** 받은 요청 목록 — ACCEPTED 건은 상대(requester) 연락처 포함. */
    public List<ReceivedContactRequestResponse> getReceived(Long targetId) {
        List<ContactRequest> requests = contactRequestRepository.findReceivedByTargetId(targetId);
        Map<Long, Profile> profiles = loadProfiles(requests.stream()
            .map(cr -> cr.getRequester().getId()).toList());

        return requests.stream()
            .map(cr -> {
                Profile p = profiles.get(cr.getRequester().getId());
                return ReceivedContactRequestResponse.of(cr, phone(p), email(p));
            })
            .toList();
    }

    /** 요청 수락 — 수신자(target)만 가능. 수락 후 상대(requester) 연락처를 반환. */
    @Transactional
    public AcceptContactResponse accept(Long requestId, Long callerId) {
        ContactRequest request = findOwnedByTarget(requestId, callerId);
        if (!request.isPending()) {
            throw new BusinessException(ErrorCode.CONTACT_REQUEST_NOT_PENDING);
        }
        request.accept();

        Profile requesterProfile = profileRepository.findById(request.getRequester().getId()).orElse(null);
        return AcceptContactResponse.of(request.getId(), phone(requesterProfile), email(requesterProfile));
    }

    /** 요청 거절 — 수신자(target)만 가능. */
    @Transactional
    public void reject(Long requestId, Long callerId) {
        ContactRequest request = findOwnedByTarget(requestId, callerId);
        if (!request.isPending()) {
            throw new BusinessException(ErrorCode.CONTACT_REQUEST_NOT_PENDING);
        }
        request.reject();
    }

    private ContactRequest findOwnedByTarget(Long requestId, Long callerId) {
        ContactRequest request = contactRequestRepository.findById(requestId)
            .orElseThrow(() -> new BusinessException(ErrorCode.CONTACT_REQUEST_NOT_FOUND));
        if (!request.getTarget().getId().equals(callerId)) {
            throw new BusinessException(ErrorCode.CONTACT_REQUEST_FORBIDDEN);
        }
        return request;
    }

    private Map<Long, Profile> loadProfiles(List<Long> memberIds) {
        return profileRepository.findAllById(memberIds).stream()
            .collect(Collectors.toMap(Profile::getMemberId, Function.identity()));
    }

    private String phone(Profile p) {
        return p != null ? p.getPhone() : null;
    }

    private String email(Profile p) {
        return p != null ? p.getEmail() : null;
    }
}
