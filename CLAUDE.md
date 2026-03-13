# 폰슐랭 — Claude Code 컨텍스트

## 프로젝트 개요
맛집을 6가지 항목(음식맛·가성비·분위기·서비스·비주얼·접근성)으로 평가하고 레이더 차트로 시각화하는 리뷰 웹앱.
앱 루트: `app/` (React + Vite + Tailwind + Supabase)

## 필수 참조 문서

작업 전 반드시 해당 도메인의 문서를 확인할 것.

| 문서 | 경로 | 역할 |
|---|---|---|
| 전체 설계도 | `skills/domain-driven/OVERVIEW.md` | DDD 구조, Context Map, 기술 스택 |
| 공유 커널 | `skills/domain-driven/shared-kernel/SHARED_KERNEL.md` | 공유 타입, Supabase 클라이언트, 디자인 토큰 |
| Identity 스펙 | `skills/domain-driven/bounded-contexts/identity/specs/SPEC.md` | 인증 도메인 상세 스펙 |
| Restaurant 스펙 | `skills/domain-driven/bounded-contexts/restaurant/specs/SPEC.md` | 맛집 등록 도메인 스펙 |
| Review 스펙 | `skills/domain-driven/bounded-contexts/review/specs/SPEC.md` | 리뷰 도메인 스펙 (Core) |
| Visualization 스펙 | `skills/domain-driven/bounded-contexts/visualization/specs/SPEC.md` | 레이더 차트 스펙 |
| Discovery 스펙 | `skills/domain-driven/bounded-contexts/discovery/specs/SPEC.md` | 피드·검색 도메인 스펙 |
| 노션 보고 스킬 | `skills/notion/SKILL.md` | 데일리 보고 형식 및 실행 방법 |

## 작업 로그 경로

작업 완료 후 해당 도메인의 LOG.md에 기록할 것.

```
skills/domain-driven/bounded-contexts/
  identity/logs/LOG.md
  restaurant/logs/LOG.md
  review/logs/LOG.md
  visualization/logs/LOG.md
  discovery/logs/LOG.md
```

## 브랜치 전략

Git Flow 기반. 상세 규칙은 `DEVELOPMENT_SCHEDULE.md` 참조.

```
main ← dev ← feature/{도메인}-{기능}-{YYMMDD}
```

커밋 컨벤션: `feat:` `fix:` `refactor:` `docs:`

## 현재 Phase

Phase 1 — `feature/identity` (인증) 진행 중 (2026-03-11 ~ 03-14)
