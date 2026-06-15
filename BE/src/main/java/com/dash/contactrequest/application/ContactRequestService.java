package com.dash.contactrequest.application;

import com.dash.contactrequest.domain.ContactRequest;
import com.dash.contactrequest.domain.ContactRequestRepository;
import com.dash.contactrequest.presentation.AcceptContactResponse;
import com.dash.contactrequest.presentation.ContactRequestResponse;
import com.dash.contactrequest.presentation.ReceivedContactRequestResponse;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Member;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import com.dash.profile.domain.Profile;
import com.dash.profile.domain.ProfileRepository;
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
        MemberId requester = MemberId.of(requesterId);
        MemberId target = MemberId.of(targetUserId);

        Member targetMember = memberRepository.findById(target)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
        if (!memberRepository.existsById(requester)) {
            throw new BusinessException(ErrorCode.MEMBER_NOT_FOUND);
        }
        if (contactRequestRepository.existsByRequesterAndTarget(requester, target)) {
            throw new BusinessException(ErrorCode.CONTACT_REQUEST_ALREADY_EXISTS);
        }

        ContactRequest saved = contactRequestRepository.save(ContactRequest.create(requester, target));
        return ContactRequestResponse.of(saved, targetMember.getNickname().value(), null, null);
    }

    /** 보낸 요청 목록 — ACCEPTED 건은 상대(target) 연락처 포함. */
    public List<ContactRequestResponse> getSent(Long requesterId) {
        List<ContactRequest> requests =
            contactRequestRepository.findSentByRequester(MemberId.of(requesterId));
        List<MemberId> targetIds = requests.stream().map(ContactRequest::getTarget).toList();
        Map<Long, String> nicknames = nicknameMap(targetIds);
        Map<Long, Profile> profiles = profileMap(targetIds);

        return requests.stream()
            .map(cr -> {
                Long tid = cr.getTarget().value();
                Profile p = profiles.get(tid);
                return ContactRequestResponse.of(cr, nicknames.get(tid), phone(p), email(p));
            })
            .toList();
    }

    /** 받은 요청 목록 — ACCEPTED 건은 상대(requester) 연락처 포함. */
    public List<ReceivedContactRequestResponse> getReceived(Long targetId) {
        List<ContactRequest> requests =
            contactRequestRepository.findReceivedByTarget(MemberId.of(targetId));
        List<MemberId> requesterIds = requests.stream().map(ContactRequest::getRequester).toList();
        Map<Long, String> nicknames = nicknameMap(requesterIds);
        Map<Long, Profile> profiles = profileMap(requesterIds);

        return requests.stream()
            .map(cr -> {
                Long rid = cr.getRequester().value();
                Profile p = profiles.get(rid);
                return ReceivedContactRequestResponse.of(cr, nicknames.get(rid), phone(p), email(p));
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
        contactRequestRepository.save(request);

        Profile requesterProfile = profileRepository.findByMemberId(request.getRequester()).orElse(null);
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
        contactRequestRepository.save(request);
    }

    private ContactRequest findOwnedByTarget(Long requestId, Long callerId) {
        ContactRequest request = contactRequestRepository.findById(requestId)
            .orElseThrow(() -> new BusinessException(ErrorCode.CONTACT_REQUEST_NOT_FOUND));
        if (!request.isTargetedAt(MemberId.of(callerId))) {
            throw new BusinessException(ErrorCode.CONTACT_REQUEST_FORBIDDEN);
        }
        return request;
    }

    private Map<Long, String> nicknameMap(List<MemberId> ids) {
        return memberRepository.findAllByIds(ids).stream()
            .collect(Collectors.toMap(m -> m.getId().value(), m -> m.getNickname().value()));
    }

    private Map<Long, Profile> profileMap(List<MemberId> ids) {
        return profileRepository.findAllByMemberIds(ids).stream()
            .collect(Collectors.toMap(p -> p.getMemberId().value(), Function.identity()));
    }

    private String phone(Profile p) {
        return p != null ? p.getPhone() : null;
    }

    private String email(Profile p) {
        return p != null ? p.getEmail() : null;
    }
}
