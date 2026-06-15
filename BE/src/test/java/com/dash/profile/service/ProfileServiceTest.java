package com.dash.profile.service;

import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Gender;
import com.dash.member.domain.Member;
import com.dash.member.repository.MemberRepository;
import com.dash.profile.domain.Profile;
import com.dash.profile.dto.MyProfileResponse;
import com.dash.profile.dto.NicknameCheckResponse;
import com.dash.profile.dto.UpdateProfileRequest;
import com.dash.profile.repository.ProfileRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock MemberRepository memberRepository;
    @Mock ProfileRepository profileRepository;
    @InjectMocks ProfileService profileService;

    private static final Long ME = 1L;

    @Test
    @DisplayName("getMyProfile: 프로필이 있으면 그대로 반환")
    void getMyProfile_returnsExisting() {
        Member member = member(ME, "josh");
        Profile profile = profile(ME, "소개글", "010-1234-5678", null);
        when(memberRepository.findById(ME)).thenReturn(Optional.of(member));
        when(profileRepository.findById(ME)).thenReturn(Optional.of(profile));

        MyProfileResponse res = profileService.getMyProfile(ME);

        assertThat(res.nickname()).isEqualTo("josh");
        assertThat(res.phone()).isEqualTo("010-1234-5678");
        assertThat(res.email()).isNull();
        assertThat(res.introText()).isEqualTo("소개글");
        verify(profileRepository, never()).save(any());
    }

    @Test
    @DisplayName("getMyProfile: 프로필이 없으면 빈 프로필을 생성하여 반환")
    void getMyProfile_createsEmptyWhenMissing() {
        Member member = member(ME, "josh");
        when(memberRepository.findById(ME)).thenReturn(Optional.of(member));
        when(profileRepository.findById(ME)).thenReturn(Optional.empty());
        when(profileRepository.save(any(Profile.class))).thenAnswer(inv -> inv.getArgument(0));

        MyProfileResponse res = profileService.getMyProfile(ME);

        assertThat(res.introText()).isEmpty();
        assertThat(res.phone()).isNull();
        verify(profileRepository).save(any(Profile.class));
    }

    @Test
    @DisplayName("getMyProfile: 회원이 없으면 MEMBER_NOT_FOUND")
    void getMyProfile_memberNotFound() {
        when(memberRepository.findById(ME)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> profileService.getMyProfile(ME))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Test
    @DisplayName("updateMyProfile: 닉네임/연락처(phone) 정상 수정")
    void updateMyProfile_success_phoneOnly() {
        Member member = member(ME, "old");
        Profile profile = profile(ME, "", null, null);
        when(memberRepository.findById(ME)).thenReturn(Optional.of(member));
        when(memberRepository.existsByNicknameAndIdNot("new", ME)).thenReturn(false);
        when(profileRepository.findById(ME)).thenReturn(Optional.of(profile));

        UpdateProfileRequest req = new UpdateProfileRequest("new", "안녕", "010-0000-1111", null);
        MyProfileResponse res = profileService.updateMyProfile(ME, req);

        assertThat(member.getNickname()).isEqualTo("new");
        assertThat(res.phone()).isEqualTo("010-0000-1111");
        assertThat(res.email()).isNull();
        assertThat(res.introText()).isEqualTo("안녕");
    }

    @Test
    @DisplayName("updateMyProfile: phone/email 둘 다 있으면 INVALID_CONTACT")
    void updateMyProfile_bothContacts_invalid() {
        Member member = member(ME, "josh");
        when(memberRepository.findById(ME)).thenReturn(Optional.of(member));

        UpdateProfileRequest req = new UpdateProfileRequest("josh", "x", "010-1", "a@b.com");

        assertThatThrownBy(() -> profileService.updateMyProfile(ME, req))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.INVALID_CONTACT));
    }

    @Test
    @DisplayName("updateMyProfile: phone/email 둘 다 없으면 INVALID_CONTACT")
    void updateMyProfile_noContact_invalid() {
        Member member = member(ME, "josh");
        when(memberRepository.findById(ME)).thenReturn(Optional.of(member));

        UpdateProfileRequest req = new UpdateProfileRequest("josh", "x", "  ", "");

        assertThatThrownBy(() -> profileService.updateMyProfile(ME, req))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.INVALID_CONTACT));
    }

    @Test
    @DisplayName("updateMyProfile: 타인이 쓰는 닉네임으로 변경 시 NICKNAME_DUPLICATED")
    void updateMyProfile_duplicateNickname() {
        Member member = member(ME, "old");
        when(memberRepository.findById(ME)).thenReturn(Optional.of(member));
        when(memberRepository.existsByNicknameAndIdNot("taken", ME)).thenReturn(true);

        UpdateProfileRequest req = new UpdateProfileRequest("taken", "x", "010-1", null);

        assertThatThrownBy(() -> profileService.updateMyProfile(ME, req))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.NICKNAME_DUPLICATED));
    }

    @Test
    @DisplayName("updateMyProfile: 닉네임 미변경 시 중복검사 생략")
    void updateMyProfile_unchangedNickname_skipsDupCheck() {
        Member member = member(ME, "same");
        Profile profile = profile(ME, "", null, null);
        when(memberRepository.findById(ME)).thenReturn(Optional.of(member));
        when(profileRepository.findById(ME)).thenReturn(Optional.of(profile));

        UpdateProfileRequest req = new UpdateProfileRequest("same", "intro", null, "a@b.com");
        profileService.updateMyProfile(ME, req);

        verify(memberRepository, never()).existsByNicknameAndIdNot(any(), anyLong());
    }

    @Test
    @DisplayName("checkNickname: 사용 가능하면 available=true, 사용중이면 false")
    void checkNickname() {
        when(memberRepository.existsByNicknameAndIdNot(eq("free"), eq(ME))).thenReturn(false);
        when(memberRepository.existsByNicknameAndIdNot(eq("used"), eq(ME))).thenReturn(true);

        NicknameCheckResponse free = profileService.checkNickname(ME, "free");
        NicknameCheckResponse used = profileService.checkNickname(ME, "used");

        assertThat(free.available()).isTrue();
        assertThat(used.available()).isFalse();
    }

    // ── fixtures ──
    private Member member(Long id, String nickname) {
        Member m = Member.create("kakao-" + id, nickname, Gender.MALE, 1990, "KR");
        ReflectionTestUtils.setField(m, "id", id);
        return m;
    }

    private Profile profile(Long memberId, String intro, String phone, String email) {
        Profile p = Profile.empty(memberId);
        p.update(intro, phone, email);
        return p;
    }
}
