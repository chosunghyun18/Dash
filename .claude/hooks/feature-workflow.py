#!/usr/bin/env python3
"""
UserPromptSubmit hook: 기능 추가 요청 감지 시 Dash 개발 워크플로우 주입.
"""
import json
import sys

WORKFLOW_CONTEXT = """[Dash 자동 워크플로우] 새 기능 요청이 감지되었습니다. 아래 순서를 반드시 따르세요.

STEP 1 — 아키텍처 설계 (be-architect / fe-architect 에이전트)
  • BE 작업 포함 시 → be-architect 에이전트 호출 (레이어드 아키텍처 설계)
  • FE 작업 포함 시 → fe-architect 에이전트 호출 (화면/컴포넌트 구조 설계)

STEP 2 — 구현 계획 (planner 에이전트)
  • planner 에이전트로 BE+FE 상세 계획 수립
  • 사용자가 "진행", "yes", "ok" 등으로 승인할 때까지 코드 작성 절대 금지

STEP 3 — 구현
  • 승인된 계획대로 레이어드 아키텍처 규칙을 준수하여 구현
  • BE: Controller → Service → Repository → Domain 방향 엄수
  • FE: Presentation → Application → Data → Infrastructure 방향 엄수

STEP 4 — 코드 리뷰 (kotlin-reviewer + security-reviewer 에이전트)
  • BE Kotlin 코드 → kotlin-reviewer
  • 인증/보안 관련 → security-reviewer

STEP 5 — 문서 갱신 (doc-updater 에이전트)
  • 코드맵(docs/CODEMAPS/) 및 memory/ 폴더 업데이트

지금 STEP 1부터 시작하세요."""

# 기능 추가 요청을 나타내는 한국어/영어 키워드
FEATURE_KEYWORDS = [
    # 한국어
    '기능 추가', '기능추가', '구현해', '구현 해', '만들어줘', '만들어 줘',
    '개발해줘', '개발 해줘', '추가해줘', '추가 해줘', '작성해줘', '작성 해줘',
    '새로운 기능', '새 기능', '새로운 화면', '새 화면', '새로운 api',
    '기능을 추가', '기능을 구현', '화면을 만', '페이지를 만', 'api를 만',
    '엔드포인트', '컨트롤러 만', '서비스 만', '레포지토리 만',
    # 영어
    'add feature', 'new feature', 'implement', 'create feature',
    'build feature', 'develop feature', 'add endpoint', 'new screen',
    'add screen', 'create screen', 'add api', 'new api',
]

def is_feature_request(prompt: str) -> bool:
    lower = prompt.lower()
    return any(kw in lower for kw in FEATURE_KEYWORDS)

def main():
    try:
        data = json.load(sys.stdin)
        prompt = (
            data.get('prompt') or
            data.get('message') or
            data.get('user_message') or ''
        )

        if is_feature_request(prompt):
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "UserPromptSubmit",
                    "additionalContext": WORKFLOW_CONTEXT
                }
            }
            print(json.dumps(output, ensure_ascii=False))

    except Exception:
        pass  # 훅 오류가 사용자 작업을 막으면 안 됨

if __name__ == '__main__':
    main()
