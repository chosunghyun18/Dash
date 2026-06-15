package com.dash.profile.application;

import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Member;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import com.dash.member.domain.Nickname;
import com.dash.profile.domain.Contact;
import com.dash.profile.domain.Profile;
import com.dash.profile.domain.ProfileRepository;
import com.dash.profile.presentation.MyProfileResponse;
import com.dash.profile.presentation.NicknameCheckResponse;
import com.dash.profile.presentation.UpdateProfileRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;

    @Transactional
    public MyProfileResponse getMyProfile(Long memberId) {
        MemberId id = MemberId.of(memberId);
        Member member = findMember(id);
        Profile profile = getOrCreateProfile(id);
        return MyProfileResponse.of(member, profile);
    }

    @Transactional
    public MyProfileResponse updateMyProfile(Long memberId, UpdateProfileRequest request) {
        MemberId id = MemberId.of(memberId);
        Member member = findMember(id);

        Contact contact = Contact.of(request.phone(), request.email());   // phone XOR email 불변식
        Nickname newNickname = Nickname.of(request.nickname());

        if (!newNickname.equals(member.getNickname())
                && memberRepository.existsByNicknameExcluding(newNickname, id)) {
            throw new BusinessException(ErrorCode.NICKNAME_DUPLICATED);
        }
        member.changeNickname(newNickname);
        memberRepository.save(member);

        Profile profile = getOrCreateProfile(id);
        profile.update(request.introText(), contact);
        Profile saved = profileRepository.save(profile);

        return MyProfileResponse.of(member, saved);
    }

    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(Long memberId, String nickname) {
        boolean available = !memberRepository.existsByNicknameExcluding(
            Nickname.of(nickname), MemberId.of(memberId));
        return new NicknameCheckResponse(available);
    }

    private Member findMember(MemberId id) {
        return memberRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
    }

    private Profile getOrCreateProfile(MemberId id) {
        return profileRepository.findByMemberId(id)
            .orElseGet(() -> profileRepository.save(Profile.empty(id)));
    }
}
