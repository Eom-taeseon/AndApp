# /spec-check — 스펙 준수 검증 스킬

구현 코드가 SPEC.md에 정의된 요구사항을 충족하는지 체크한다.

## 사용법

- `/spec-check` — 전체 도메인 검증
- `/spec-check {도메인}` — 특정 도메인만 검증

## 인자

`$ARGUMENTS`가 있으면 해당 도메인만, 없으면 전체 도메인 검증.

---

## 실행 절차

### 1. SPEC.md에서 요구사항 추출

`skills/domain-driven/bounded-contexts/{도메인}/specs/SPEC.md`를 읽고 다음을 추출:

| 항목 | 설명 |
|---|---|
| **컴포넌트 목록** | 구현해야 할 React 컴포넌트 (.jsx) |
| **훅 목록** | 커스텀 훅 (useXxx.js) |
| **Repository 목록** | 데이터 접근 레이어 (xxxRepository.js) |
| **Value Object 목록** | 도메인 객체 (xxx.js) |
| **기능 요구사항** | SPEC에 명시된 동작/기능 |
| **UI 요구사항** | 화면 구성, 반응형, 접근성 등 |

### 2. 구현 상태 확인

`app/` 디렉토리를 탐색하여:

- SPEC에 명시된 각 파일이 존재하는지 확인
- 파일이 존재하면 내용을 읽어서:
  - 주요 함수/컴포넌트가 export 되어 있는지
  - SPEC에 명시된 props/파라미터를 받고 있는지
  - 핵심 로직(유효성 검증, 에러 처리 등)이 구현되어 있는지

### 3. DEVELOPMENT_SCHEDULE.md와 교차 확인

- 해당 도메인의 작업 목록에서 `- [x]` 체크된 항목과 실제 구현 상태 비교
- 체크되었지만 실제로 미구현인 항목 감지

### 4. 결과 출력

```
## 스펙 준수 검증 — {도메인}

### 구현 완료
- [x] LoginForm.jsx — 이메일 로그인 폼 (SPEC 2.1)
- [x] AuthContext.jsx — 전역 인증 상태 (SPEC 3.1)

### 미구현 (구현 필요)
- [ ] SignupForm.jsx — 회원가입 폼 (SPEC 2.2)
  - 파일 존재하지 않음
- [ ] AuthPage.jsx — 라우팅 (SPEC 4.1)
  - 파일 존재하지만 리다이렉트 로직 없음

### 부분 구현 (보완 필요)
- [~] LoginForm.jsx — 에러 메시지 표시 (SPEC 2.1.3)
  - 로그인 실패 시 에러 표시 로직 누락

### 요약
- 총 요구사항: N개
- 구현 완료: N개 (N%)
- 미구현: N개
- 부분 구현: N개
```

---

## 도메인 매핑

| 인자 | SPEC 경로 |
|---|---|
| identity | `bounded-contexts/identity/specs/SPEC.md` |
| restaurant | `bounded-contexts/restaurant/specs/SPEC.md` |
| review | `bounded-contexts/review/specs/SPEC.md` |
| visualization | `bounded-contexts/visualization/specs/SPEC.md` |
| discovery | `bounded-contexts/discovery/specs/SPEC.md` |

## 에러 처리

- SPEC.md가 없는 도메인: 에러 메시지 출력
- `app/` 디렉토리가 없으면: 에러
- SPEC에 구체적 파일명이 없는 경우: 기능 요구사항 기준으로 검증

## 주의사항

- 코드 품질이나 스타일은 검증하지 않음 (그건 `/simplify` 역할)
- "구현 완료" 판정은 파일 존재 + 핵심 로직 존재 기준이며, 동작 테스트는 포함하지 않음
- SPEC이 업데이트되면 검증 기준도 자동으로 반영됨
