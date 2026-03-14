# 📝 작업 로그

> Context 스펙: [../specs/SPEC.md]
> 생성일: 2026-03-09

---

## ⚡ 강조 사항 (항상 기억할 것)

- `authService.js`가 Supabase Auth SDK의 ACL 역할 (직접 SDK 호출 금지)
- `useAuth()` 훅은 `hooks/useAuth.js`에서 re-export, 원본은 `AuthContext.jsx`
- Mock 모드: `VITE_SUPABASE_URL` 미설정 시 자동 전환
- 닉네임 2~20자, 비밀번호 8자 이상 클라이언트 검증

---

## 🛠️ 작업 로그

### [2026-03-14] Phase 1 마무리 — 폼 수정 + dev PR 준비

**작업 내용:**
- `LoginForm.jsx`: password 입력에 `required` 속성 추가
- `SignupForm.jsx`: `needsEmailConfirm` 응답 처리 — 이메일 인증 안내 메시지 표시
- `feature/identity-guard-260314` → `dev` PR 준비 (push 완료)

**결과:**
- Phase 1 코드 작업 완료
- dev PR 생성 대기 (GitHub에서 수동 생성 필요)

### [2026-03-14] authService ACL 추출 + useAuth 훅 분리

**작업 내용:**
- `services/authService.js` 생성 — Supabase Auth SDK 호출을 ACL로 캡슐화
  - signUp, signIn, signOut, getCurrentUser, onAuthStateChange, fetchProfile
- `AuthContext.jsx` 리팩토링 — authService 의존으로 전환, 직접 SDK 호출 제거
- `hooks/useAuth.js` 생성 — 스펙 디렉터리 구조에 맞게 re-export

**결과:**
- 빌드 성공 확인
- 스펙의 ACL 패턴 및 디렉터리 구조 준수

### [2026-03-14] ProtectedRoute 인증 가드 추가

**작업 내용:**
- `App.jsx`에 `ProtectedRoute` 컴포넌트 추가
- `/review/new` 라우트를 `ProtectedRoute`로 감싸 미인증 시 `/auth`로 리다이렉트
- Phase 1 완료 기준 충족: 미인증 사용자 리다이렉트 동작

**결과:**
- 빌드 성공 확인
- `/review/new` 접근 시 미인증이면 `/auth`로 `<Navigate replace />` 처리

### [2026-03-11~13] Identity Context 기본 구현

**작업 내용:**
- `AuthContext.jsx`: 전역 인증 상태 Provider (signIn/signUp/signOut, 세션 복원)
- `LoginForm.jsx`: 이메일/비밀번호 로그인 폼 + 데모 계정 힌트
- `SignupForm.jsx`: 닉네임+이메일+비밀번호 회원가입 폼 + 유효성 검증
- `AuthPage.jsx`: 로그인/회원가입 탭 전환 UI

**결과:**
- Supabase Auth 연동 완료 (+ Mock 모드 지원)
- `onAuthStateChange`로 세션 유지 동작

---

## 🐛 디버깅 & 오류 기록

(아직 없음)

---

## 💡 메모 & 아이디어

- ~~authService.js ACL 분리는 추후 리팩터링 시 진행~~ → 완료 (2026-03-14)
- Supabase `users` 테이블 + RLS 정책은 DB 콘솔에서 수동 적용 필요

---

## ✅ 완료 체크리스트

- [x] 기본 기능 구현 (로그인/회원가입/로그아웃)
- [x] 에러 핸들링 (폼 유효성 검증 + 에러 메시지)
- [x] 모바일 반응형 확인 (max-w-md 레이아웃)
- [ ] Supabase RLS 정책 적용 (DB 콘솔에서 수동 적용 필요)
- [x] 미인증 사용자 리다이렉트 (`/review/new` → `/auth`)
- [x] SignupForm 이메일 인증 안내 메시지 처리
- [x] LoginForm password required 속성 추가
- [ ] `dev` PR 생성 및 머지 (GitHub에서 수동)
