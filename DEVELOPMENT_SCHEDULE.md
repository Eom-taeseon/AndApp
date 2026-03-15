# 🍽️ 폰슐랭 — 개발 일정

> 브랜치 전략: Git Flow — `main` ← `dev` ← `feature/*` (기능별 브랜치)
> 기준일: 2026-03-11

---

## 브랜치 개요

```
main                              ← 프로덕션 릴리스 (태그: v1.0.0)
├── hotfix/{버전}-{이슈번호}       ← main에서 분기 → main + dev 머지
└── dev                           ← 개발 통합
    ├── feature/{도메인}-{기능}-{YYMMDD}  ← dev에서 분기 → dev PR 머지
    └── release/{버전}-{YYMMDD}          ← dev에서 분기 → QA → main + dev 머지
```

### 브랜치 네이밍 규칙

| 타입 | 패턴 | 예시 |
|---|---|---|
| feature | `feature/{도메인}-{기능}-{YYMMDD}` | `feature/identity-login-260311` |
| release | `release/{버전}-{YYMMDD}` | `release/1.0.0-260330` |
| hotfix | `hotfix/{버전}-{이슈번호}` | `hotfix/1.0.1-#42` |

---

## Phase 1 — `feature/identity` (인증)
**기간**: 2026-03-11 ~ 2026-03-14
**목표**: 사용자 인증 플로우 완성

### 작업 목록
- [ ] Supabase Auth 이메일 로그인 연동 (`LoginForm.jsx`)
- [ ] 회원가입 폼 완성 + 닉네임 입력 (`SignupForm.jsx`)
- [ ] `AuthContext` 전역 상태 (세션 유지, 로그아웃)
- [ ] `AuthPage` 라우팅 및 리다이렉트 처리
- [ ] 인증 완료 후 `dev` PR 생성

### 완료 기준
- 로그인/로그아웃이 정상 동작하고 세션이 유지됨
- 미인증 사용자가 `/review/new` 접근 시 `/auth`로 리다이렉트

---

## Phase 2 — `feature/restaurant` (맛집 등록)
**기간**: 2026-03-15 ~ 2026-03-18
**목표**: 네이버 플레이스 기반 맛집 등록 기능

### 작업 목록
- [ ] 네이버 검색 API Vercel API Route 프록시 구현
- [ ] `RestaurantSearchInput.jsx` — 검색 자동완성
- [ ] 선택된 장소 Supabase `restaurants` 테이블 upsert
- [ ] `restaurantRepository.js` 완성
- [ ] 인증 완료 후 `dev` PR 생성

### 완료 기준
- 장소 검색 후 선택하면 DB에 저장됨 (중복 시 기존 레코드 재사용)

---

## Phase 3 — `feature/review` + `feature/visualization` (리뷰 + 레이더 차트)
**기간**: 2026-03-19 ~ 2026-03-25
**목표**: 핵심 기능 — 6항목 리뷰 작성 + 레이더 차트 시각화

### `feature/review` 작업 목록
- [ ] `ScoreInput.jsx` — 0.5 단위 별점 입력 UI
- [ ] `ReviewForm.jsx` — 맛집 선택 + 6항목 입력 + 텍스트 후기
- [ ] `reviewRepository.js` — insert / fetch
- [ ] `useReviewForm.js` 훅 완성
- [ ] `ScoreSet.js` value object 검증 로직

### `feature/visualization` 작업 목록 (병행)
- [ ] `ReviewRadarChart.jsx` — Recharts 기반 육각형 레이더 차트
- [ ] `MiniRadarChart.jsx` — 피드 카드용 축소 버전
- [ ] `LiveRadarPreview.jsx` — 리뷰 작성 중 실시간 미리보기

### 완료 기준
- 리뷰 작성 → 저장 → 레이더 차트로 시각화까지 E2E 동작

---

## Phase 4 — `feature/discovery` (피드 & 검색)
**기간**: 2026-03-26 ~ 2026-03-30
**목표**: 사용자 탐색 경험 완성

### 작업 목록
- [ ] `FeedPage.jsx` — 최신 리뷰 타임라인 (MiniRadarChart 포함)
- [ ] `SearchPage.jsx` — 맛집 검색 + 필터링
- [ ] `RestaurantDetailPage.jsx` — 맛집 상세 + 리뷰 목록 + 평균 레이더 차트
- [ ] `ProfilePage.jsx` — 내 리뷰 모아보기

### 완료 기준
- 피드에서 리뷰 카드 확인 → 맛집 상세 진입 → 전체 리뷰 조회 흐름 동작

---

## 전체 타임라인

| Phase | 브랜치 | 시작 | 종료 | 상태 |
|---|---|---|---|---|
| 1 | `feature/identity` | 2026-03-11 | 2026-03-14 | ✅ 완료 |
| 2 | `feature/restaurant` | 2026-03-15 | 2026-03-18 | ✅ 완료 |
| 3 | `feature/review` + `feature/visualization` | 2026-03-19 | 2026-03-25 | ⬜ 대기 |
| 4 | `feature/discovery` | 2026-03-26 | 2026-03-30 | ⬜ 대기 |

---

## 작업 규칙

- 각 Phase 완료 시 `dev` 브랜치로 PR 생성 후 병합
- `main` 병합은 모든 Phase 완료 후 최종 QA 이후
- 커밋 컨벤션: `feat:`, `fix:`, `refactor:`, `docs:`

---

_이 파일은 Claude Code 예약 세션이 자동으로 참조합니다._
