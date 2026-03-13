# 🍽️ 폰슐랭 (Fonsle) — 맛집 리뷰 웹앱 프레임워크

> "미슐랭은 별점, 우리는 6각형으로"
> 6가지 항목으로 맛집을 입체적으로 평가하는 리뷰 서비스

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | 폰슐랭 (가칭) |
| 목표 | 6가지 항목 세부 평가로 차별화된 맛집 리뷰 플랫폼 |
| 타깃 사용자 | 맛집 탐방을 즐기는 일반 사용자 |
| 핵심 차별점 | 단순 별점이 아닌 6축 레이더 차트 기반 평가 시스템 |
| 문서 구조 | skills/ 폴더 — 1-depth(설계도) / 2-depth(스펙) / 3-depth(로그) |

---

## 2. 6가지 평가 항목

| 항목 | 설명 | 아이콘 |
|---|---|---|
| 음식맛 | 음식이 얼마나 맛있는지 | 🍴 |
| 가성비 | 돈이 아깝지 않은지 | 💰 |
| 분위기 | 가게 인테리어·분위기 | 🌿 |
| 서비스 | 직원 서비스 수준 | 🙏 |
| 비주얼 | 음식 플레이팅, 사진 퀄리티 | 📸 |
| 접근성 | 교통·주차 편의성 | 📍 |

각 항목 1~5점 (0.5점 단위) → 레이더 차트로 시각화

---

## 3. 기술 스택

### Frontend
- **React** + **Vite** (빠른 개발환경)
- **Tailwind CSS** (스타일링)
- **Recharts** 또는 **Chart.js** (6각형 레이더 차트)
- **React Router** (페이지 라우팅)

### Backend
- **Supabase** (PostgreSQL DB + 인증 + 스토리지 통합)
  - 별도 서버 없이 빠르게 시작 가능
  - 사진 업로드도 Supabase Storage 활용

### 지도
- **네이버 지도 API + 네이버 플레이스 검색 API** (NCP) — 장소 검색 시 주소·위치 자동 입력 가능

### 배포
- **Vercel** (프론트엔드 무료 배포)

---

## 4. 주요 기능 목록

### MVP (1차 목표)
- [ ] 회원가입 / 로그인 (Supabase Auth)
- [ ] 맛집 등록 (이름, 위치, 카테고리)
- [ ] 6항목 별점 입력 + 리뷰 작성
- [ ] 레이더 차트로 점수 시각화
- [ ] 맛집 목록 / 상세 페이지

### 2차 목표
- [ ] 사진 업로드
- [ ] 항목별 필터링 (예: "분위기 4.5 이상")
- [ ] 팔로우 / 피드 기능
- [ ] 항목별 필터링 (예: "분위기 4.5 이상")
- [ ] 내 리뷰 모아보기

---

## 5. 데이터 모델 (초안)

```
[users]
- id, email, nickname, profile_image, created_at

[restaurants]
- id, name, address, category, naver_place_id, lat, lng, created_at

[reviews]
- id, user_id, restaurant_id
- score_taste        (음식맛)    FLOAT
- score_value        (가성비)    FLOAT
- score_atmosphere   (분위기)    FLOAT
- score_service      (서비스)    FLOAT
- score_visual       (비주얼)    FLOAT
- score_access       (접근성)    FLOAT
- score_total        (평균)      FLOAT (자동 계산)
- content            TEXT
- visited_at         DATE
- created_at

[review_images]
- id, review_id, image_url, order
```

---

## 6. 역할 분담 — 코워크 vs 클로드 코드

### 🖥️ 코워크 모드가 담당
| 업무 | 산출물 |
|---|---|
| 기획 및 요구사항 정의 | PRD 문서 |
| 화면 구성 (와이어프레임 설명) | 페이지별 레이아웃 명세 |
| DB 스키마 설계 | 데이터 모델 문서 |
| 스프린트 계획 | 할일 목록 / 우선순위 |
| 결과물 파일 정리 | 문서, 보고서 |

### 💻 클로드 코드가 담당
| 업무 | 산출물 |
|---|---|
| 프로젝트 초기 세팅 | Vite + React 스캐폴딩 |
| 컴포넌트 개발 | UI 코드 |
| Supabase 연동 | API / DB 코드 |
| 레이더 차트 구현 | Chart 컴포넌트 |
| 네이버맵 연동 | 지도 컴포넌트 |
| 배포 설정 | vercel.json 등 |

---

## 7. 추천 작업 순서

```
Phase 1 (코워크) : PRD 작성 → 화면 명세 → DB 스키마 확정
Phase 2 (코드)   : 프로젝트 세팅 → DB 구축 → 기본 UI
Phase 3 (코드)   : 리뷰 기능 → 레이더 차트 → 인증
Phase 4 (코드)   : 지도 연동 → 사진 업로드
Phase 5 (코워크) : 테스트 피드백 → 개선 기획
Phase 6 (코드)   : 2차 기능 개발 → 배포
```

---

## 8. 바로 다음 할 일

**코워크에서 먼저:**
1. PRD (제품 요구사항 문서) 작성
2. 주요 화면 리스트 및 레이아웃 명세

**클로드 코드에서 바로 시작 가능:**
```bash
# 터미널에서 실행
npm create vite@latest fonsle -- --template react
cd fonsle
npm install
npm install tailwindcss @tailwindcss/vite recharts react-router-dom @supabase/supabase-js
```
