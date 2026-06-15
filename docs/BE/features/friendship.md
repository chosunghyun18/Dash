# 기능: 친구 (Friendship)

**패키지:** `com.dash.friendship` · **테이블:** [friendships](../database/friendships.md), [profiles](../database/profiles.md)

내 친구 목록 조회. (친구 생성은 [초대](invitation.md) 수락으로 이루어짐.)

## 엔드포인트

| 메서드 | 경로 | 요청 | 응답 |
|--------|------|------|------|
| GET | `/api/v1/friends` | — | `FriendResponse[]` |

### DTO

```
FriendResponse { id, userId, nickname, profileImageUrl, bio }
```
- `id` = friendship.id, `userId` = 상대 member.id
- `bio` = 상대 profiles.intro_text, `profileImageUrl` = profiles.profile_image_url

## 구성 파일

- `controller/FriendshipController` · `service/FriendshipService`
- `dto/FriendResponse`
- `domain/Friendship`, `repository/FriendshipRepository`

## 핵심 로직 (`FriendshipService.getMyFriends`)

1. `findAllByMemberId(me)` — 내가 속한 친구 관계 전부 (상대 회원 fetch join)
2. 각 관계에서 `other(f, me)` 로 상대 회원 추출
3. 상대 id 목록으로 `profileRepository.findAllById` 일괄 조회 → Map
4. `FriendResponse.of(friendshipId, friend, profile)` 매핑 (프로필 없으면 bio/image=null)

## 에러

- 인증 실패 시 401. 그 외 도메인 에러 없음 (빈 목록 정상 반환).

## 메모

- 친구 관계는 `member_a_id < member_b_id` 단일 레코드 → 서비스에서 양방향 처리
- 프로필 일괄 조회로 N+1 회피
