# /feature — 기능 브랜치 관리 스킬

기능 단위로 feature 브랜치를 생성하고, 작업 완료 시 LOG 기록 + PR 생성까지 자동화한다.

## 사용법

- `/feature start {도메인}-{기능}` — 새 기능 브랜치 시작
- `/feature done` — 현재 기능 브랜치 완료 처리

## 인자

`$ARGUMENTS` 를 파싱하여 모드와 파라미터를 결정한다.

---

## 모드 1: `start {도메인}-{기능}`

### 실행 절차

1. **현재 브랜치 확인**: `dev` 브랜치가 아니면 `dev`로 체크아웃하고 pull
2. **브랜치 생성**: `feature/{도메인}-{기능}-{YYMMDD}` 형식으로 생성
   - YYMMDD는 오늘 날짜 (예: 260314)
   - 예시: `/feature start identity-login` → `feature/identity-login-260314`
3. **도메인 식별**: 첫 번째 `-` 앞의 단어로 도메인 판별
   - identity, restaurant, review, visualization, discovery 중 하나
4. **SPEC 요약**: 해당 도메인의 `skills/domain-driven/bounded-contexts/{도메인}/specs/SPEC.md`를 읽고 관련 요구사항 요약 표시
5. **일정 확인**: `DEVELOPMENT_SCHEDULE.md`에서 해당 기능과 관련된 작업 항목을 찾아 표시

### 출력 형식

```
## feature/{도메인}-{기능}-{YYMMDD} 브랜치 생성 완료

### 관련 스펙 요약
- (SPEC.md에서 추출한 핵심 요구사항)

### 관련 작업 항목
- [ ] (DEVELOPMENT_SCHEDULE.md에서 매칭된 항목)

### 다음 단계
작업을 진행한 후 `/feature done`으로 완료 처리하세요.
```

---

## 모드 2: `done`

### 실행 절차

1. **현재 브랜치 확인**: `feature/`로 시작하는 브랜치인지 검증. 아니면 에러
2. **브랜치명 파싱**: `feature/{도메인}-{기능}-{YYMMDD}`에서 도메인 추출
3. **변경사항 수집**:
   - `git log dev..HEAD --oneline`으로 커밋 목록
   - `git diff dev --stat`으로 변경 파일 통계
4. **LOG.md 기록**: `skills/domain-driven/bounded-contexts/{도메인}/logs/LOG.md`에 아래 형식으로 추가
   ```
   ### [YYYY-MM-DD] {기능} 완료

   **작업 내용:**
   - (커밋 메시지 기반 요약)

   **결과:**
   - 변경 파일: N개
   - 커밋: N개

   ---
   ```
5. **DEVELOPMENT_SCHEDULE.md 업데이트**: 해당 작업 항목을 `- [x]`로 체크 (매칭 가능한 항목만)
6. **dev PR 생성**: `gh pr create` 로 PR 생성
   - 타이틀: `feat({도메인}): {기능} 구현`
   - 본문:
     ```
     ## Summary
     - (커밋 기반 변경사항 요약)

     ## Changed Files
     - (변경 파일 목록)

     ## Checklist
     - [ ] 코드 리뷰
     - [ ] 기능 테스트
     - [ ] 모바일 반응형 확인

     Generated with [Claude Code](https://claude.com/claude-code)
     ```
7. **결과 출력**

### 출력 형식

```
## feature/{브랜치명} 완료 처리

### 작업 요약
- 커밋 N개, 변경 파일 N개
- (주요 변경사항 요약)

### 완료 항목
- [x] LOG.md 기록
- [x] DEVELOPMENT_SCHEDULE.md 업데이트
- [x] dev PR 생성 → {PR URL}
```

---

## 에러 처리

- `start` 시 이미 feature 브랜치에 있으면: 경고 후 현재 브랜치에서 `done`을 먼저 실행할지 확인
- `done` 시 feature 브랜치가 아니면: 에러 메시지 출력
- 도메인이 5개 중 하나와 매칭되지 않으면: 경고 표시 후 LOG 기록 생략
- 커밋이 없으면 (dev와 동일): PR 생성 없이 안내 메시지 출력

## 주의사항

- 브랜치 push는 PR 생성 시 자동으로 수행 (`-u origin` 플래그)
- `done` 실행 전 반드시 모든 변경사항이 커밋되어 있어야 함 (uncommitted changes 있으면 경고)
- PR은 `dev` 브랜치를 base로 생성
