package com.dash.profile.application;

import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.member.domain.Gender;
import com.dash.member.domain.Member;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import com.dash.member.domain.MemberStatus;
import com.dash.member.domain.Nickname;
import com.dash.profile.domain.Contact;
import com.dash.profile.domain.Profile;
import com.dash.profile.domain.ProfileRepository;
import com.dash.profile.presentation.MyProfileResponse;
import com.dash.profile.presentation.NicknameCheckResponse;
import com.dash.profile.presentation.UpdateProfileRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock MemberRepository memberRepository;
    @Mock ProfileRepository profileRepository;
    @InjectMocks ProfileService profileService;

    private static final long ME = 1L;
    private static final MemberId ME_ID = MemberId.of(ME);

    @Test
    @DisplayName("getMyProfile: 프로필이 있으면 그대로 반환")
    void getMyProfile_returnsExisting() {
        when(memberRepository.findById(ME_ID)).thenReturn(Optional.of(member(ME, "josh")));
        when(profileRepository.findByMemberId(ME_ID))
            .thenReturn(Optional.of(profile(ME, "소개글", "010-1234-5678", null)));

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
        when(memberRepository.findById(ME_ID)).thenReturn(Optional.of(member(ME, "josh")));
        when(profileRepository.findByMemberId(ME_ID)).thenReturn(Optional.empty());
        when(profileRepository.save(any(Profile.class))).thenAnswer(inv -> inv.getArgument(0));

        MyProfileResponse res = profileService.getMyProfile(ME);

        assertThat(res.introText()).isEmpty();
        assertThat(res.phone()).isNull();
        verify(profileRepository).save(any(Profile.class));
    }

    @Test
    @DisplayName("getMyProfile: 회원이 없으면 MEMBER_NOT_FOUND")
    void getMyProfile_memberNotFound() {
        when(memberRepository.findById(ME_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> profileService.getMyProfile(ME))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Test
    @DisplayName("updateMyProfile: 닉네임/연락처(phone) 정상 수정")
    void updateMyProfile_success_phoneOnly() {
        when(memberRepository.findById(ME_ID)).thenReturn(Optional.of(member(ME, "old")));
        when(memberRepository.existsByNicknameExcluding(Nickname.of("new"), ME_ID)).thenReturn(false);
        when(profileRepository.findByMemberId(ME_ID)).thenReturn(Optional.of(profile(ME, "", null, null)));
        when(profileRepository.save(any(Profile.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateProfileRequest req = new UpdateProfileRequest("new", "안녕", "010-0000-1111", null);
        MyProfileResponse res = profileService.updateMyProfile(ME, req);

        assertThat(res.nickname()).isEqualTo("new");
        assertThat(res.phone()).isEqualTo("010-0000-1111");
        assertThat(res.email()).isNull();
        assertThat(res.introText()).isEqualTo("안녕");
    }

    @Test
    @DisplayName("updateMyProfile: phone/email 둘 다 있으면 INVALID_CONTACT")
    void updateMyProfile_bothContacts_invalid() {
        when(memberRepository.findById(ME_ID)).thenReturn(Optional.of(member(ME, "josh")));

        UpdateProfileRequest req = new UpdateProfileRequest("josh", "x", "010-1", "a@b.com");

        assertThatThrownBy(() -> profileService.updateMyProfile(ME, req))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.INVALID_CONTACT));
    }

    @Test
    @DisplayName("updateMyProfile: phone/email 둘 다 없으면 INVALID_CONTACT")
    void updateMyProfile_noContact_invalid() {
        when(memberRepository.findById(ME_ID)).thenReturn(Optional.of(member(ME, "josh")));

        UpdateProfileRequest req = new UpdateProfileRequest("josh", "x", "  ", "");

        assertThatThrownBy(() -> profileService.updateMyProfile(ME, req))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.INVALID_CONTACT));
    }

    @Test
    @DisplayName("updateMyProfile: 타인이 쓰는 닉네임으로 변경 시 NICKNAME_DUPLICATED")
    void updateMyProfile_duplicateNickname() {
        when(memberRepository.findById(ME_ID)).thenReturn(Optional.of(member(ME, "old")));
        when(memberRepository.existsByNicknameExcluding(Nickname.of("taken"), ME_ID)).thenReturn(true);

        UpdateProfileRequest req = new UpdateProfileRequest("taken", "x", "010-1", null);

        assertThatThrownBy(() -> profileService.updateMyProfile(ME, req))
            .isInstanceOfSatisfying(BusinessException.class,
                e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.NICKNAME_DUPLICATED));
    }

    @Test
    @DisplayName("updateMyProfile: 닉네임 미변경 시 중복검사 생략")
    void updateMyProfile_unchangedNickname_skipsDupCheck() {
        when(memberRepository.findById(ME_ID)).thenReturn(Optional.of(member(ME, "same")));
        when(profileRepository.findByMemberId(ME_ID)).thenReturn(Optional.of(profile(ME, "", null, null)));
        when(profileRepository.save(any(Profile.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateProfileRequest req = new UpdateProfileRequest("same", "intro", null, "a@b.com");
        profileService.updateMyProfile(ME, req);

        verify(memberRepository, never()).existsByNicknameExcluding(any(), any());
    }

    @Test
    @DisplayName("checkNickname: 사용 가능하면 available=true, 사용중이면 false")
    void checkNickname() {
        when(memberRepository.existsByNicknameExcluding(Nickname.of("free"), ME_ID)).thenReturn(false);
        when(memberRepository.existsByNicknameExcluding(Nickname.of("used"), ME_ID)).thenReturn(true);

        NicknameCheckResponse free = profileService.checkNickname(ME, "free");
        NicknameCheckResponse used = profileService.checkNickname(ME, "used");

        assertThat(free.available()).isTrue();
        assertThat(used.available()).isFalse();
    }

    // ── fixtures ──
    private Member member(long id, String nickname) {
        return Member.reconstitute(MemberId.of(id), "kakao-" + id, Nickname.of(nickname),
            Gender.MALE, 1990, MemberStatus.ACTIVE, "KR");
    }

    private Profile profile(long memberId, String intro, String phone, String email) {
        return Profile.reconstitute(MemberId.of(memberId), intro, null, Contact.reconstitute(phone, email));
    }
}
