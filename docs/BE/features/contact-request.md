# 기능: 연락 요청 (Contact Request)

**패키지:** `com.dash.contactrequest` · **테이블:** [contact_requests](../database/contact_requests.md), [profiles](../database/profiles.md)

지인에게 연락처 공개를 요청 → 수신자가 수락하면 서로의 연락처를 교환.

## 엔드포인트

| 메서드 | 경로 | 요청 | 응답 |
|--------|------|------|------|
| POST | `/api/v1/contact-requests` | `{ targetUserId }` | `ContactRequestResponse` |
| GET | `/api/v1/contact-requests/sent` | — | `ContactRequestResponse[]` |
| GET | `/api/v1/contact-requests/received` | — | `ReceivedContactRequestResponse[]` |
| POST | `/api/v1/contact-requests/{requestId}/accept` | — | `AcceptContactResponse` |
| POST | `/api/v1/contact-requests/{requestId}/reject` | — | 200 |

### DTO

```
CreateContactRequestRequest    { targetUserId }            // @NotNull
ContactRequestResponse         { id, targetUserId, targetNickname, status, createdAt, contactPhone?, contactEmail? }
ReceivedContactRequestResponse { id, requesterUserId, requesterNickname, status, createdAt, contactPhone?, contactEmail? }
AcceptContactResponse          { requestId, contactPhone?, contactEmail? }
```

## 구성 파일

- `controller/ContactRequestController` · `service/ContactRequestService`
- `dto/` 4종 · `domain/ContactRequest`, `ContactRequestStatus` · `repository/ContactRequestRepository`

## 핵심 로직 (`ContactRequestService`)

- **create** (`@Transactional`) — 자기요청 차단(`CANNOT_REQUEST_SELF`) → target/requester 존재 확인 → 중복 차단(`CONTACT_REQUEST_ALREADY_EXISTS`) → PENDING 저장. (생성 직후 연락처 미노출)
- **getSent** — 요청자 시점 목록. ACCEPTED 건은 **target(상대) 연락처** 포함 (프로필 일괄 조회)
- **getReceived** — 수신자 시점 목록. ACCEPTED 건은 **requester(상대) 연락처** 포함
- **accept** (`@Transactional`) — `findOwnedByTarget`(수신자만, 아니면 403) → PENDING 아니면 409 → ACCEPTED 전환 → **requester 연락처** 반환
- **reject** (`@Transactional`) — 동일 권한/상태 검증 → REJECTED

### 연락처 노출 규칙

연락처는 PENDING/REJECTED에서 **항상 null**, ACCEPTED에서만 **상대방** 것이 노출 (양방향 교환). 상세 표는 [contact_requests.md](../database/contact_requests.md#연락처-노출-규칙-중요) 참조.

## 에러

| 코드 | HTTP | 상황 |
|------|------|------|
| `CANNOT_REQUEST_SELF` | 400 | 자기 자신에게 요청 |
| `MEMBER_NOT_FOUND` | 404 | 대상/요청자 없음 |
| `CONTACT_REQUEST_ALREADY_EXISTS` | 409 | 동일 대상 중복 요청 |
| `CONTACT_REQUEST_NOT_FOUND` | 404 | requestId 없음 |
| `CONTACT_REQUEST_FORBIDDEN` | 403 | 수신자가 아닌데 수락/거절 |
| `CONTACT_REQUEST_NOT_PENDING` | 409 | 이미 처리된 요청 |

## 메모

- `via`(소개 경로)는 미제공 — 친구 그래프 경로 계산 필요(추후)
- 연락처는 contact_requests에 저장하지 않고 profiles JOIN (중복 저장 회피)
