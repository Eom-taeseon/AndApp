# 📝 작업 로그

> Context 스펙: [../specs/SPEC.md]
> 생성일: 2026-03-09

---

## ⚡ 강조 사항 (항상 기억할 것)

- `useAuth()` 훅은 `AuthContext.jsx`에서 export (별도 파일 아님)
- Mock 모드: `VITE_SUPABASE_URL` 미설정 시 자동 전환
- 닉네임 2~20자, 비밀번호 8자 이상 클라이언트 검증

---

## 🛠️ 작업 로그

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

- authService.js ACL 분리는 추후 리팩터링 시 진행 (현재는 AuthContext에 직접 구현)
- Supabase `users` 테이블 + RLS 정책은 DB 콘솔에서 수동 적용 필요

---

## ✅ 완료 체크리스트

- [x] 기본 기능 구현 (로그인/회원가입/로그아웃)
- [x] 에러 핸들링 (폼 유효성 검증 + 에러 메시지)
- [x] 모바일 반응형 확인 (max-w-md 레이아웃)
- [ ] Supabase RLS 정책 적용 (DB 콘솔에서 수동 적용 필요)
- [x] 미인증 사용자 리다이렉트 (`/review/new` → `/auth`)
