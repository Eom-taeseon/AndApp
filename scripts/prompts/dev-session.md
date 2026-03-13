# 폰슐랭 자동 개발 세션

지금부터 폰슐랭 프로젝트의 자동 개발 세션을 시작한다. 아래 절차를 순서대로 정확히 따라라.

## 실행 절차

### Step 1 — 현재 상태 파악
1. `DEVELOPMENT_SCHEDULE.md`를 읽어 현재 Phase와 미완료 작업 목록을 확인한다.
2. `git status`와 `git branch` 로 현재 브랜치를 확인한다.
3. 현재 Phase에 해당하는 `feature/*` 브랜치가 없으면 `dev`에서 분기하여 생성한다.
   - 네이밍: `feature/{도메인}-{기능}-{YYMMDD}` (예: `feature/identity-login-260314`)
   - Phase 1 → `feature/identity-*`
   - Phase 2 → `feature/restaurant-*`
   - Phase 3 → `feature/review-*` 또는 `feature/visualization-*`
   - Phase 4 → `feature/discovery-*`
4. 해당 feature 브랜치로 checkout한다.

### Step 2 — 다음 작업 선택
1. 해당 Phase의 LOG.md를 읽어 이미 완료된 작업을 확인한다.
   - 경로: `skills/domain-driven/bounded-contexts/{domain}/logs/LOG.md`
2. DEVELOPMENT_SCHEDULE.md의 미완료 작업 중 **가장 첫 번째 항목 하나**를 선택한다.
3. 해당 도메인의 SPEC.md를 읽는다.
   - 경로: `skills/domain-driven/bounded-contexts/{domain}/specs/SPEC.md`
4. `skills/domain-driven/shared-kernel/SHARED_KERNEL.md`를 읽는다.

### Step 3 — 구현
1. 선택한 작업을 SPEC.md 명세에 따라 구현한다.
2. 기존 코드를 먼저 읽고 파악한 뒤 수정한다.
3. **스펙에 없는 기능은 절대 추가하지 않는다.**
4. **한 번에 하나의 작업만 구현한다.**

### Step 4 — 커밋
1. 구현이 완료되면 변경된 파일을 git add한다.
2. 아래 형식으로 커밋한다:
   ```
   feat: {작업 내용 한 줄 요약}
   ```
3. 커밋 후 `git push`한다. (원격 브랜치가 없으면 `-u origin {브랜치명}`)

### Step 5 — LOG 업데이트
해당 도메인의 LOG.md에 아래 형식으로 작업을 기록한다:

```markdown
## {YYYY-MM-DD}

### ✅ {작업 제목}
- 구현한 내용 요약
- 변경된 파일 목록
- 특이사항 또는 이슈
```

### Step 6 — Phase 완료 확인
현재 Phase의 모든 작업이 완료되었으면:
1. feat 브랜치에서 `dev` 브랜치로 PR을 생성한다.
   ```
   gh pr create --base dev --head feature/{domain}-{기능}-{YYMMDD} \
     --title "Phase {N}: {domain} 완료" \
     --body "## 완료된 작업\n{완료 목록}\n\n## 완료 기준 달성\n{완료 기준 체크}"
   ```
2. PR 생성 후 사용자에게 검토 및 머지를 요청하는 메시지를 출력한다.
3. 다음 Phase는 PR 머지 이후 시작한다.

## 제약 사항

- 브랜치는 반드시 `feature/*` → `dev` 방향으로만 작업한다. `main`에 직접 push하지 않는다.
- 커밋 메시지 컨벤션: `feat:` / `fix:` / `refactor:` / `docs:`
- Supabase 환경변수는 `app/.env`에 이미 설정되어 있으므로 수정하지 않는다.
- 현재 Phase가 없거나 모든 Phase가 완료된 경우, 작업 없음 상태를 출력하고 종료한다.
