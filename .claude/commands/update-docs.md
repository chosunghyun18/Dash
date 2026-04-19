---
description: 코드베이스에서 문서와 코드맵을 자동 갱신. doc-updater 에이전트 호출.
---

# /update-docs

doc-updater 에이전트를 호출하여 BE + FE 코드맵을 갱신하고 memory/ 폴더를 업데이트합니다.

## 실행 내용
1. `BE/src/` 스캔 → `docs/CODEMAPS/backend.md` 갱신
2. `FE/app/` 스캔 → `docs/CODEMAPS/frontend.md` 갱신
3. REST 엔드포인트 목록 추출
4. memory/ 폴더 아키텍처 메모 업데이트
