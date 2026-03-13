# 🍽️ 폰슐랭 (Fonsle)

> "미슐랭은 별점, 우리는 6각형으로"

맛집을 **6가지 항목**으로 평가하고 **레이더 차트**로 시각화하는 리뷰 웹앱.

## 6가지 평가 항목

| 항목 | 아이콘 | 설명 |
|---|---|---|
| 음식맛 | 🍴 | 음식이 얼마나 맛있는지 |
| 가성비 | 💰 | 돈이 아깝지 않은지 |
| 분위기 | 🌿 | 가게 인테리어·분위기 |
| 서비스 | 🙏 | 직원 서비스 수준 |
| 비주얼 | 📸 | 음식 플레이팅, 사진 퀄리티 |
| 접근성 | 📍 | 교통·주차 편의성 |

각 항목 1~5점 (0.5점 단위) → 레이더 차트로 시각화

## 시작하기

```bash
cd app
npm install
npm run dev
```

### 환경 변수

`app/.env` 파일에 다음 값을 설정:

```
VITE_SUPABASE_URL=<Supabase 프로젝트 URL>
VITE_SUPABASE_ANON_KEY=<Supabase anon key>
```

## 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | React 19 + Vite 7 + Tailwind CSS 4 |
| Chart | Recharts (레이더 차트) |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| 맛집 검색 | 네이버 플레이스 검색 API |
| 배포 | Vercel |

## 프로젝트 구조

```
app/
├── src/
│   ├── domains/           # DDD Bounded Contexts
│   │   ├── identity/      # 인증 (로그인/회원가입)
│   │   ├── restaurant/    # 맛집 등록/검색
│   │   ├── review/        # 6항목 리뷰 작성 (Core Domain)
│   │   ├── visualization/ # 레이더 차트
│   │   └── discovery/     # 피드/검색/맛집 상세
│   ├── shared/            # Shared Kernel (타입, 유틸, Supabase 클라이언트)
│   └── pages/             # 라우트 페이지
├── supabase/              # DB 마이그레이션 SQL
└── skills/                # DDD 설계 문서 (스펙, 로그)
```

## TODO

### Phase 1 — 인증 (진행 중)
- [ ] Supabase Auth 이메일 로그인 연동
- [ ] 회원가입 폼 + 닉네임 입력
- [ ] AuthContext 전역 상태 (세션 유지, 로그아웃)
- [ ] AuthPage 라우팅 및 리다이렉트

### Phase 2 — 맛집 등록
- [ ] 네이버 검색 API 프록시 구현
- [ ] 맛집 검색 자동완성
- [ ] Supabase restaurants 테이블 upsert

### Phase 3 — 리뷰 + 시각화
- [ ] 6항목 별점 입력 UI (0.5 단위)
- [ ] 리뷰 작성 폼 + 저장
- [ ] 레이더 차트 (대형/소형/실시간 미리보기)

### Phase 4 — 피드 & 검색
- [ ] 최신 리뷰 타임라인 피드
- [ ] 맛집 검색 + 필터링
- [ ] 맛집 상세 + 평균 레이더 차트
- [ ] 내 리뷰 모아보기


