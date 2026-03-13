# 🔍 Discovery Context — 스펙

> 최종 수정: 2026-03-09
> Context 유형: Supporting
> 담당 Phase: Phase 6

---

## 도메인 역할

사용자가 맛집과 리뷰를 **발견**하는 모든 경로를 담당한다.
여러 Context(Review, Restaurant, Identity)의 데이터를 **읽기 전용으로 조합**하여 제공.

### Published Language

Review + Restaurant + Identity의 데이터를 조합한 **FeedItem** DTO를 정의한다.

```js
// domains/discovery/types/FeedItem.js
// Review + Restaurant + User를 조합한 읽기 전용 DTO
export const FeedItem = {
  reviewId: 'UUID',
  restaurant: { name: 'String', category: 'String', address: 'String' },
  user: { nickname: 'String', profileImage: 'String?' },
  scores: 'ScoreSet',
  totalScore: 'Decimal',
  content: 'String',
  visitedAt: 'Date',
  createdAt: 'DateTime',
}
```

---

## 화면 구성

### 홈 피드 (`/`)
- 최신 리뷰 카드 목록 (무한 스크롤)
- 카드: 대표사진 → 가게이름 → 카테고리 → 총점 + 소형 레이더 → 리뷰 요약
- 1회 로드: 10개 (Intersection Observer)

### 맛집 상세 (`/restaurant/:id`)
```
[상단] 맛집 이름 + 카테고리 + 주소
[중단] 항목별 평균 점수 + 레이더 차트 (Large)
[하단] 네이버 지도 (300px)
[하단] 리뷰 목록 (ReviewCard 반복)
```

### 검색 (`/search`)
- MVP: 가게 이름 텍스트 검색 (`ILIKE`)
- 2차: 항목별 최소 점수 필터, 카테고리 필터

---

## DB 쿼리 패턴

```js
// 최신 리뷰 피드 (Published Language 조합)
const { data } = await supabase
  .from('reviews')
  .select(`
    *,
    restaurants (name, category, address),
    users (nickname, profile_image)
  `)
  .order('created_at', { ascending: false })
  .range(offset, offset + 9)

// 맛집 상세 - 평균 점수 집계
const { data } = await supabase
  .from('reviews')
  .select('score_taste, score_value, score_atmosphere, score_service, score_visual, score_access')
  .eq('restaurant_id', id)
```

---

## 컴포넌트 구조

```
domains/discovery/
├── components/
│   ├── FeedPage.jsx                # 홈 피드 페이지
│   ├── RestaurantDetailPage.jsx    # 맛집 상세 페이지
│   ├── SearchPage.jsx              # 검색 페이지
│   └── SearchFilter.jsx            # 항목별 필터 (2차)
├── hooks/
│   ├── useInfiniteScroll.js        # 무한 스크롤 훅
│   └── useFeed.js                  # 피드 데이터 조회 훅
└── services/
    └── feedService.js              # 피드 쿼리 서비스
```

---

## 불변 규칙 (Invariants)

- 리뷰 없는 맛집은 피드에 노출하지 않음
- 맛집 평균 점수는 DB View 또는 캐싱 활용 고려
- 검색 결과 없을 때 "등록된 맛집이 없습니다" + 등록 유도 CTA
- 무한 스크롤 시 중복 로드 방지 (offset 관리)
