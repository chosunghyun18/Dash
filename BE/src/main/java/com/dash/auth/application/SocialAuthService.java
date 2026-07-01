package com.dash.auth.application;

import com.dash.auth.domain.SocialProvider;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.global.security.JwtProvider;
import com.dash.member.domain.Member;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import com.dash.member.domain.Nickname;
import com.dash.profile.domain.Contact;
import com.dash.profile.domain.Profile;
import com.dash.profile.domain.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 소셜 로그인/등록 애플리케이션 서비스 — 등록 토큰 방식.
 *
 * <p>소셜 ID 는 기존 members.kakao_id 컬럼을 {@code "<provider>:<subject>"} 형식으로 재사용한다.
 * 미등록 소셜 ID 로그인 시 회원을 즉시 만들지 않고 단기 registration 토큰을 발급하며
 * ({@code isNewUser=true}), 실제 회원은 {@link #register} 에서 gender 포함 전체 프로필과 함께
 * 생성한다 (Apple/Google 이 gender 를 제공하지 않기 때문).
 */
@Service
@Transactional
public class SocialAuthService {

    /** 전역 닉네임 중복확인용 — 존재하지 않는 id 로 제외 없이 전체 대상 검사. */
    private static final MemberId NO_EXCLUDE = MemberId.of(-1L);

    private final Map<SocialProvider, SocialTokenVerifier> verifiers;
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final JwtProvider jwtProvider;

    public SocialAuthService(List<SocialTokenVerifier> verifiers,
                             MemberRepository memberRepository,
                             ProfileRepository profileRepository,
                             JwtProvider jwtProvider) {
        this.verifiers = new EnumMap<>(SocialProvider.class);
        verifiers.forEach(v -> this.verifiers.put(v.provider(), v));
        this.memberRepository = memberRepository;
        this.profileRepository = profileRepository;
        this.jwtProvider = jwtProvider;
    }

    /**
     * 소셜 토큰으로 로그인. 기존 회원이면 정식 JWT 세션 발급,
     * 미등록이면 registration 토큰 발급({@code isNewUser=true}).
     */
    public SocialLoginResult login(SocialProvider provider, String rawToken) {
        SocialAccount account = verifiers.get(provider).verify(rawToken);
        String socialId = provider.socialId(account.subject());

        return memberRepository.findByKakaoId(socialId)
            .map(this::issueSession)
            .orElseGet(() -> new SocialLoginResult(
                jwtProvider.generateRegistrationToken(socialId), "", "", true));
    }

    /**
     * 등록 토큰 + 프로필 정보로 신규 회원 생성 후 정식 JWT 세션 발급.
     * 이미 같은 소셜 ID 의 회원이 있으면(중복 등록) 그 회원으로 로그인 처리한다.
     */
    public SocialLoginResult register(String registrationToken, RegisterCommand cmd) {
        if (!jwtProvider.isValid(registrationToken)
                || !JwtProvider.TYPE_REGISTRATION.equals(jwtProvider.extractType(registrationToken))) {
            throw new BusinessException(ErrorCode.INVALID_SOCIAL_TOKEN);
        }
        String socialId = jwtProvider.extractSubject(registrationToken);

        Optional<Member> existing = memberRepository.findByKakaoId(socialId);
        if (existing.isPresent()) {
            return issueSession(existing.get());   // 중복가입 방지 — 기존 회원으로 로그인
        }

        Nickname nickname = Nickname.of(cmd.nickname());
        if (memberRepository.existsByNicknameExcluding(nickname, NO_EXCLUDE)) {
            throw new BusinessException(ErrorCode.NICKNAME_DUPLICATED);
        }

        Member saved = memberRepository.save(
            Member.create(socialId, nickname, cmd.gender(), cmd.birthYear(), "KR"));

        profileRepository.save(initialProfile(saved.getId(), cmd));

        return issueSession(saved);
    }

    private Profile initialProfile(MemberId memberId, RegisterCommand cmd) {
        Profile profile = Profile.empty(memberId);
        boolean hasContact = hasText(cmd.phone()) || hasText(cmd.email());
        if (hasText(cmd.introText()) || hasContact) {
            // phone/email 둘 다 없으면 빈 연락처 허용, 하나 주어지면 Contact.of(XOR 불변식) 적용
            Contact contact = hasContact ? Contact.of(cmd.phone(), cmd.email()) : null;
            profile.update(cmd.introText() != null ? cmd.introText() : "", contact);
        }
        return profile;
    }

    private SocialLoginResult issueSession(Member member) {
        Long memberId = member.getId().value();
        return new SocialLoginResult(
            jwtProvider.generateAccessToken(memberId),
            jwtProvider.generateRefreshToken(memberId),
            String.valueOf(memberId),
            false);
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
