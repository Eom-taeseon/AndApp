# 폰슐랭 데일리 브리핑

지금부터 폰슐랭 프로젝트의 데일리 브리핑을 생성하고 로컬 파일에 기록한다.

## 실행 절차

### Step 1 — 작업 현황 수집
1. `git log --oneline -20` 으로 최근 커밋 내역을 확인한다.
2. 모든 도메인의 LOG.md를 읽는다:
   - `skills/domain-driven/bounded-contexts/identity/logs/LOG.md`
   - `skills/domain-driven/bounded-contexts/restaurant/logs/LOG.md`
   - `skills/domain-driven/bounded-contexts/review/logs/LOG.md`
   - `skills/domain-driven/bounded-contexts/visualization/logs/LOG.md`
   - `skills/domain-driven/bounded-contexts/discovery/logs/LOG.md`
3. `DEVELOPMENT_SCHEDULE.md`를 읽어 전체 진행률을 파악한다.

### Step 2 — 현재 시간 파악
현재 시간을 확인하여 오전(06:00~17:59) / 오후(18:00~05:59) 판별한다.

### Step 3 — 브리핑 파일 생성
`scripts/logs/YYYY-MM-DD-briefing.md` 파일을 생성하여 아래 형식으로 저장한다.
파일이 이미 존재하면 오전/오후 섹션을 추가(append)한다.

```markdown
# {YYYY-MM-DD} {오전|오후} 폰슐랭 브리핑

## 📊 전체 진행률
- 현재 Phase: Phase {N} — {브랜치명}
- 완료 작업: {완료 수} / {전체 수}
- 예정 완료일: {날짜}

## 🔧 금일 작업 내용

### Identity Context
- (해당 작업 없으면 생략)

### Restaurant Context
- (해당 작업 없으면 생략)

### Review Context (Core)
- (해당 작업 없으면 생략)

### Visualization Context
- (해당 작업 없으면 생략)

### Discovery Context
- (해당 작업 없으면 생략)

## 📁 변경된 파일
{git log에서 수집한 변경 파일 목록}

## 🐛 이슈 & 디버깅
{LOG.md에서 수집한 이슈 내용, 없으면 "없음"}

## 📌 다음 작업 계획
{DEVELOPMENT_SCHEDULE.md 기준 다음 미완료 작업}
```

### Step 4 — 완료
브리핑 파일 경로를 출력하고 종료한다.
작업 내용이 없는 날에도 "작업 없음" 내용으로 파일을 생성한다.
