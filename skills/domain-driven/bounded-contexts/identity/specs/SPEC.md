# 🔐 Identity Context — 스펙

> 최종 수정: 2026-03-09
> Context 유형: Supporting
> 담당 Phase: Phase 3

---

## 도메인 모델

### Aggregate Root: User

```
User (Aggregate Root)
├── id: UUID (= auth.users.id)
├── email: String
├── nickname: String
├── profileImage: String?
└── createdAt: DateTime
```

### 도메인 이벤트

| 이벤트 | 발행 시점 | 소비자 |
|---|---|---|
| UserRegistered | 회원가입 완료 | Review Context (리뷰 작성 권한 부여) |
| UserLoggedIn | 로그인 성공 | Discovery Context (개인화 피드) |
| UserLoggedOut | 로그아웃 | 전체 (세션 정리) |

---

## Anti-Corruption Layer

Supabase Auth는 외부 의존성이므로 ACL로 감싸서 도메인 계층을 보호한다.

```
[Supabase Auth SDK] ──ACL──▶ [Identity Service] ──▶ [도메인 모델]
```

```js
// domains/identity/services/authService.js
// Supabase Auth SDK 호출을 캡슐화
export const authService = {
  async signUp({ email, password, nickname }) { ... },
  async signIn({ email, password }) { ... },
  async signOut() { ... },
  async getCurrentUser() { ... },
  onAuthStateChange(callback) { ... },
}
```

---

## DB 스키마

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id),
  nickname      TEXT NOT NULL,
  profile_image TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: 본인 프로필만 수정 가능
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "프로필 조회는 모두 가능" ON users FOR SELECT USING (true);
CREATE POLICY "프로필 수정은 본인만" ON users FOR UPDATE USING (auth.uid() = id);
```

---

## 컴포넌트 구조

```
domains/identity/
├── components/
│   ├── AuthPage.jsx          # 로그인/회원가입 탭 전환
│   ├── LoginForm.jsx         # 로그인 폼
│   └── SignupForm.jsx        # 회원가입 폼
├── hooks/
│   └── useAuth.js            # 인증 상태 관리 훅
├── services/
│   └── authService.js        # Supabase Auth ACL
└── context/
    └── AuthContext.jsx        # 전역 인증 상태 Provider
```

---

## 사용자 흐름

```
[비로그인] 홈 접근 → 리뷰 열람 가능 (읽기 허용)
         리뷰 작성 시도 → /auth로 리다이렉트

[회원가입] 이메일+비밀번호+닉네임 → Supabase 인증 메일 → 인증 완료 → 로그인

[로그인]  이메일+비밀번호 → 토큰 발급 → 홈으로 이동
```

---

## 불변 규칙 (Invariants)

- 닉네임은 필수, 2~20자
- 비밀번호 최소 8자
- 이메일 중복 가입 불가
- 로그인 상태는 `AuthContext`로 전역 관리
- 새로고침 시 세션 유지 (`onAuthStateChange`)
