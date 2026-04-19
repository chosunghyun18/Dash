---
description: BE는 kotlin-reviewer + security-reviewer, FE는 security-reviewer로 코드 리뷰.
---

# /review

변경된 코드를 리뷰합니다.

- BE Kotlin 코드 → kotlin-reviewer 에이전트
- 인증/보안 관련 코드 → security-reviewer 에이전트
- FE 코드 → security-reviewer 에이전트 (React Native 보안 관점)
