package com.dash.profile.service;

import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Member;
import com.dash.member.repository.MemberRepository;
import com.dash.profile.domain.Profile;
import com.dash.profile.dto.MyProfileResponse;
import com.dash.profile.dto.NicknameCheckResponse;
import com.dash.profile.dto.UpdateProfileRequest;
import com.dash.profile.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;

    @Transactional
    public MyProfileResponse getMyProfile(Long memberId) {
        Member member = findMember(memberId);
        Profile profile = getOrCreateProfile(memberId);
        return MyProfileResponse.of(member, profile);
    }

    @Transactional
    public MyProfileResponse updateMyProfile(Long memberId, UpdateProfileRequest request) {
        Member member = findMember(memberId);

        String phone = normalize(request.phone());
        String email = normalize(request.email());
        validateContact(phone, email);

        String nickname = request.nickname().trim();
        if (!nickname.equals(member.getNickname())
                && memberRepository.existsByNicknameAndIdNot(nickname, memberId)) {
            throw new BusinessException(ErrorCode.NICKNAME_DUPLICATED);
        }
        member.changeNickname(nickname);

        Profile profile = getOrCreateProfile(memberId);
        profile.update(request.introText(), phone, email);

        return MyProfileResponse.of(member, profile);
    }

    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(Long memberId, String nickname) {
        boolean available = !memberRepository.existsByNicknameAndIdNot(nickname.trim(), memberId);
        return new NicknameCheckResponse(available);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
    }

    private Profile getOrCreateProfile(Long memberId) {
        return profileRepository.findById(memberId)
            .orElseGet(() -> profileRepository.save(Profile.empty(memberId)));
    }

    /** phone / email 중 정확히 하나만 존재해야 한다. */
    private void validateContact(String phone, String email) {
        boolean hasPhone = StringUtils.hasText(phone);
        boolean hasEmail = StringUtils.hasText(email);
        if (hasPhone == hasEmail) {
            throw new BusinessException(ErrorCode.INVALID_CONTACT);
        }
    }

    /** 빈 문자열/공백은 null 로 정규화하여 XOR 판정 및 저장 일관성을 유지한다. */
    private String normalize(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
