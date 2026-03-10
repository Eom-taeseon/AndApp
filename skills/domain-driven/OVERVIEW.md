# 🍽️ 폰슐랭 — Domain-Driven Design 전체 설계도

> 최종 수정: 2026-03-09
> 상태: 기획 완료 → 개발 시작

---

## 1. 프로젝트 컨셉

### 한 줄 소개

> "미슐랭은 별점, 폰슐랭은 6각형으로 — 맛집을 입체적으로 기록하는 리뷰 플랫폼"

### 핵심 도메인 (Core Domain)

**리뷰 평가 시스템** — 6가지 독립 항목(맛·가성비·분위기·서비스·데코레이션·접근성)을 점수화하여 레이더 차트로 시각화하는 것이 이 서비스의 핵심 가치.

### 유비쿼터스 언어 (Ubiquitous Language)


| 용어      | 정의                            | 영문             |
| ------- | ----------------------------- | -------------- |
| 평가 항목   | 6가지 독립 점수 카테고리                | ScoreDimension |
| 레이더 프로필 | 6항목 점수를 시각화한 육각형 차트           | RadarProfile   |
| 리뷰      | 하나의 맛집 방문에 대한 6항목 점수 + 텍스트 후기 | Review         |
| 맛집      | 네이버 플레이스 기반 음식점 엔티티           | Restaurant     |
| 종합점수    | 6항목의 단순 평균 (자동 산출)            | TotalScore     |
| 피드      | 최신 리뷰 목록의 타임라인 뷰              | Feed           |


---

## 2. Bounded Context Map

```
┌─────────────────────────────────────────────────────┐
│                    폰슐랭 시스템                       │
│                                                       │
│  ┌──────────┐    ┌─────────────┐    ┌──────────────┐  │
│  │ Identity │───▶│  Restaurant │◀───│   Review     │  │
│  │ Context  │    │  Context    │    │   Context    │  │
│  │          │    │             │    │  (Core)      │  │
│  └──────────┘    └─────────────┘    └──────┬───────┘  │
│       │                                     │         │
│       │          ┌─────────────┐    ┌───────▼───────┐ │
│       └─────────▶│  Discovery  │◀───│Visualization │ │
│                  │  Context    │    │  Context      │ │
│                  └─────────────┘    └───────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Context 간 관계


| 관계                     | 유형                 | 설명                      |
| ---------------------- | ------------------ | ----------------------- |
| Identity → Review      | Customer-Supplier  | 인증된 사용자만 리뷰 작성 가능       |
| Restaurant → Review    | Shared Kernel      | Restaurant ID를 공유       |
| Review → Visualization | Conformist         | 레이더 차트는 리뷰 점수 형식에 종속    |
| Review → Discovery     | Published Language | 피드·검색은 리뷰 데이터를 읽기 전용 소비 |


---

## 3. Bounded Contexts 요약

### 🔐 Identity Context

사용자 인증·프로필 관리. Supabase Auth에 의존하는 인프라 계층.

### 🏠 Restaurant Context

네이버 플레이스 API 기반 맛집 엔티티 관리. 외부 API 연동과 좌표 변환을 캡슐화.

### ⭐ Review Context (Core Domain)

6항목 독립 평가 + 텍스트 후기 + 이미지. 총점 자동 산출. 핵심 비즈니스 로직.

### 📊 Visualization Context

레이더 차트 렌더링. Review Context의 점수 데이터를 읽기 전용으로 소비.

### 🔍 Discovery Context

피드(타임라인), 검색, 필터링. 여러 Context의 데이터를 조합하여 사용자에게 제공.

---

## 4. 기술 스택


| 계층            | 기술                    | 용도                  |
| ------------- | --------------------- | ------------------- |
| Presentation  | React + Vite          | 프론트엔드               |
| Styling       | Tailwind CSS          | 유틸리티 기반 스타일링        |
| Routing       | React Router          | SPA 라우팅             |
| Visualization | Recharts              | 레이더 차트              |
| Persistence   | Supabase (PostgreSQL) | DB + Auth + Storage |
| External API  | 네이버 NCP               | 지도 렌더링 + 장소 검색      |
| Deployment    | Vercel                | 프론트 배포 + API Route  |


---

## 5. 도메인 레이어 구조 (프론트엔드 기준)

```
src/
├── domains/                    # Bounded Context별 모듈
│   ├── identity/               # 인증
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── restaurant/             # 맛집
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── review/                 # 리뷰 (Core)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── value-objects/      # ScoreDimension, TotalScore
│   ├── visualization/          # 레이더 차트
│   │   └── components/
│   └── discovery/              # 피드 & 검색
│       ├── components/
│       ├── hooks/
│       └── services/
├── shared/                     # Shared Kernel
│   ├── components/             # 공용 UI (Button, Modal 등)
│   ├── lib/                    # Supabase 클라이언트, 유틸
│   └── types/                  # 공유 타입 정의
├── pages/                      # 라우트별 페이지 컴포넌트
└── App.jsx
```

---

## 6. 작업 단계 (Phase)


| Phase | 담당  | Context                | 내용                          |
| ----- | --- | ---------------------- | --------------------------- |
| 1     | 코워크 | 전체                     | PRD + DDD 설계 + UI 프로토타입 ✅   |
| 2     | 코드  | Shared                 | Vite 세팅 + Supabase 연결 + 라우팅 |
| 3     | 코드  | Identity               | 회원가입/로그인                    |
| 4     | 코드  | Restaurant             | 맛집 등록 + 네이버 지도              |
| 5     | 코드  | Review + Visualization | 리뷰 작성 + 레이더 차트              |
| 6     | 코드  | Discovery              | 피드 / 목록 / 상세 페이지            |
| 7     | 코드  | Review                 | 사진 업로드 + 필터 검색              |
| 8     | 코워크 | 전체                     | QA 피드백 + 개선 기획              |
| 9     | 코드  | 전체                     | 2차 기능 + Vercel 배포           |


---

## 7. 변경 이력


| 날짜         | 내용                              |
| ---------- | ------------------------------- |
| 2026-03-07 | 초기 설계도 작성, 지도 API 네이버맵 확정       |
| 2026-03-09 | DDD 기반 Bounded Context 구조로 리팩터링 |


