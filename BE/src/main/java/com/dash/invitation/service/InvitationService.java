package com.dash.invitation.service;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.repository.FriendshipRepository;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.invitation.domain.Invitation;
import com.dash.invitation.domain.InvitationStatus;
import com.dash.invitation.dto.InvitationAcceptResponse;
import com.dash.invitation.dto.InvitationCreateResponse;
import com.dash.invitation.dto.InvitationSummary;
import com.dash.invitation.dto.InvitationValidateResponse;
import com.dash.invitation.repository.InvitationRepository;
import com.dash.member.domain.Member;
import com.dash.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final FriendshipRepository friendshipRepository;
    private final MemberRepository memberRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    @Transactional
    public InvitationCreateResponse create(Long inviterId) {
        Member inviter = findMember(inviterId);
        String token = generateUniqueToken();
        Invitation invitation = Invitation.create(inviter, token);
        invitationRepository.save(invitation);
        return InvitationCreateResponse.of(invitation, baseUrl);
    }

    public InvitationValidateResponse validate(String token) {
        Invitation invitation = invitationRepository.findByTokenWithInviter(token)
            .orElseThrow(() -> new BusinessException(ErrorCode.INVITATION_NOT_FOUND));

        if (invitation.getStatus() != InvitationStatus.PENDING || invitation.isExpired()) {
            throw new BusinessException(ErrorCode.INVITATION_NOT_AVAILABLE);
        }
        return InvitationValidateResponse.of(invitation);
    }

    @Transactional
    public InvitationAcceptResponse accept(String token, Long inviteeId) {
        Invitation invitation = invitationRepository.findByTokenWithInviter(token)
            .orElseThrow(() -> new BusinessException(ErrorCode.INVITATION_NOT_FOUND));

        Member invitee = findMember(inviteeId);

        if (invitation.getInviter().getId().equals(inviteeId)) {
            throw new BusinessException(ErrorCode.CANNOT_INVITE_SELF);
        }
        if (friendshipRepository.existsBetween(invitation.getInviter().getId(), inviteeId)) {
            throw new BusinessException(ErrorCode.ALREADY_FRIENDS);
        }

        invitation.accept(invitee);
        Friendship friendship = Friendship.create(invitation.getInviter(), invitee);
        friendshipRepository.save(friendship);

        return InvitationAcceptResponse.of(invitation, friendship);
    }

    public List<InvitationSummary> getMyInvitations(Long memberId) {
        return invitationRepository.findByInviterIdOrderByCreatedAtDesc(memberId)
            .stream()
            .map(inv -> InvitationSummary.of(inv, baseUrl))
            .toList();
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
    }

    private String generateUniqueToken() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        } while (invitationRepository.existsByToken(token));
        return token;
    }
}
