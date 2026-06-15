package com.dash.invitation.application;

import com.dash.friendship.domain.Friendship;
import com.dash.friendship.domain.FriendshipRepository;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.invitation.domain.Invitation;
import com.dash.invitation.domain.InvitationRepository;
import com.dash.invitation.domain.InvitationToken;
import com.dash.invitation.presentation.InvitationAcceptResponse;
import com.dash.invitation.presentation.InvitationCreateResponse;
import com.dash.invitation.presentation.InvitationSummary;
import com.dash.invitation.presentation.InvitationValidateResponse;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

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
        MemberId inviter = MemberId.of(inviterId);
        if (!memberRepository.existsById(inviter)) {
            throw new BusinessException(ErrorCode.MEMBER_NOT_FOUND);
        }
        Invitation invitation = invitationRepository.save(Invitation.create(inviter, generateUniqueToken()));
        return InvitationCreateResponse.of(invitation, baseUrl);
    }

    public InvitationValidateResponse validate(String token) {
        Invitation invitation = invitationRepository.findByToken(InvitationToken.of(token))
            .orElseThrow(() -> new BusinessException(ErrorCode.INVITATION_NOT_FOUND));
        if (!invitation.isPending() || invitation.isExpired()) {
            throw new BusinessException(ErrorCode.INVITATION_NOT_AVAILABLE);
        }
        return InvitationValidateResponse.of(invitation, nicknameOf(invitation.getInviter()));
    }

    @Transactional
    public InvitationAcceptResponse accept(String token, Long inviteeId) {
        Invitation invitation = invitationRepository.findByToken(InvitationToken.of(token))
            .orElseThrow(() -> new BusinessException(ErrorCode.INVITATION_NOT_FOUND));

        MemberId invitee = MemberId.of(inviteeId);
        if (!memberRepository.existsById(invitee)) {
            throw new BusinessException(ErrorCode.MEMBER_NOT_FOUND);
        }
        if (invitation.getInviter().equals(invitee)) {
            throw new BusinessException(ErrorCode.CANNOT_INVITE_SELF);
        }
        if (friendshipRepository.existsBetween(invitation.getInviter(), invitee)) {
            throw new BusinessException(ErrorCode.ALREADY_FRIENDS);
        }

        invitation.accept(invitee);
        invitationRepository.save(invitation);
        Friendship friendship = friendshipRepository.save(Friendship.create(invitation.getInviter(), invitee));

        return InvitationAcceptResponse.of(invitation, friendship.getId(), nicknameOf(invitation.getInviter()));
    }

    public List<InvitationSummary> getMyInvitations(Long memberId) {
        List<Invitation> invitations =
            invitationRepository.findByInviterOrderByCreatedAtDesc(MemberId.of(memberId));

        List<MemberId> inviteeIds = invitations.stream()
            .map(Invitation::getInvitee).filter(Objects::nonNull).toList();
        Map<Long, String> inviteeNicknames = memberRepository.findAllByIds(inviteeIds).stream()
            .collect(Collectors.toMap(m -> m.getId().value(), m -> m.getNickname().value()));

        return invitations.stream()
            .map(inv -> {
                String inviteeNickname = inv.getInvitee() == null
                    ? null : inviteeNicknames.get(inv.getInvitee().value());
                return InvitationSummary.of(inv, baseUrl, inviteeNickname);
            })
            .toList();
    }

    private String nicknameOf(MemberId id) {
        return memberRepository.findById(id).map(m -> m.getNickname().value()).orElse(null);
    }

    private InvitationToken generateUniqueToken() {
        InvitationToken token;
        do {
            token = InvitationToken.generate();
        } while (invitationRepository.existsByToken(token));
        return token;
    }
}
