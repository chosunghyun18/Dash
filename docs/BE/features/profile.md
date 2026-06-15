# 기능: 내 프로필 (Profile)

**패키지:** `com.dash.profile` · **테이블:** [profiles](../database/profiles.md), [members](../database/members.md)

로그인 회원 본인의 프로필 조회/수정 및 닉네임 중복 확인.

## 엔드포인트

| 메서드 | 경로 | 요청 | 응답 |
|--------|------|------|------|
| GET | `/api/v1/users/me/profile` | — | `MyProfileResponse` |
| PUT | `/api/v1/users/me/profile` | `UpdateProfileRequest` | `MyProfileResponse` |
| GET | `/api/v1/users/nickname-check?nickname=` | query | `NicknameCheckResponse` |

### DTO

```
MyProfileResponse     { nickname, phone, email, introText }
UpdateProfileRequest  { nickname, introText, phone?, email? }
NicknameCheckResponse { available: boolean }
```

## 구성 파일

- `controller/ProfileController` · `service/ProfileService`
- `dto/MyProfileResponse`, `UpdateProfileRequest`, `NicknameCheckResponse`
- `domain/Profile`, `repository/ProfileRepository`

## 핵심 로직 (`ProfileService`)

- **getMyProfile** — member 조회(없으면 404) → 프로필 `getOrCreate`(없으면 빈 프로필 INSERT) → 응답
- **updateMyProfile** (`@Transactional`)
  1. phone/email 빈 문자열 → null 정규화
  2. `validateContact` — phone/email **정확히 하나**가 아니면 `INVALID_CONTACT` (400)
  3. 닉네임이 현재와 다르면 `existsByNicknameAndIdNot`로 중복검사 → 있으면 `NICKNAME_DUPLICATED` (409)
  4. `member.changeNickname`, `profile.update(introText, phone, email)`
- **checkNickname** — `!existsByNicknameAndIdNot(nickname, me)` → 본인 현재 닉네임은 `available=true`

## 검증 (Bean Validation)

- `nickname` `@NotBlank @Size(1~12)` (members.nickname VARCHAR(12)와 일치)
- `introText` `@NotNull @Size(max 500)` (빈 문자열 허용)
- `phone` `@Size(max 20)` `@Pattern(^[0-9+\-]*$)` · `email` `@Email @Size(max 255)`
- phone XOR email은 Bean Validation으로 불가 → 서비스에서 검증
- `nickname-check` query param: 컨트롤러 `@Validated` + `@NotBlank @Size(1~12)` → `ConstraintViolationException` → 400

## 에러

| 코드 | HTTP | 상황 |
|------|------|------|
| `MEMBER_NOT_FOUND` | 404 | member 없음 |
| `NICKNAME_DUPLICATED` | 409 | 타인이 쓰는 닉네임 |
| `INVALID_CONTACT` | 400 | phone/email 둘 다 또는 둘 다 없음 |
| `VALIDATION_ERROR` | 400 | Bean Validation 위반 |

## 메모

- 프로필 row 부재 시 빈 프로필 자동 생성 (404 아님) — signup 미구현 대비
- 동시 닉네임 경합의 최종 방어선은 `UNIQUE(nickname)`. 현재 DataIntegrityViolation→409 매핑은 미적용
