# 🏠 Restaurant Context — 스펙

> 최종 수정: 2026-03-09
> Context 유형: Supporting
> 담당 Phase: Phase 4

---

## 도메인 모델

### Aggregate Root: Restaurant

```
Restaurant (Aggregate Root)
├── id: UUID
├── naverPlaceId: String (UNIQUE, 외부 식별자)
├── name: String
├── address: String
├── category: String
├── location: ValueObject
│   ├── lat: Float
│   └── lng: Float
├── phone: String?
└── createdAt: DateTime
```

### Value Object: Location

좌표를 캡슐화한 값 객체. 네이버 카텍 좌표 → WGS84 변환 로직을 내부에 포함.

```js
// domains/restaurant/value-objects/Location.js
export class Location {
  constructor(lat, lng) {
    this.lat = lat
    this.lng = lng
  }

  static fromNaverKatech(mapx, mapy) {
    return new Location(
      parseInt(mapy) / 1e7,
      parseInt(mapx) / 1e7
    )
  }
}
```

---

## Anti-Corruption Layer (네이버 API)

네이버 Search API의 응답 형식을 도메인 모델로 변환하는 ACL.

```js
// domains/restaurant/services/naverPlaceAdapter.js
export function toRestaurant(naverItem) {
  return {
    naverPlaceId: extractPlaceId(naverItem.link),
    name: stripHtml(naverItem.title),
    address: naverItem.roadAddress || naverItem.address,
    category: naverItem.category,
    location: Location.fromNaverKatech(naverItem.mapx, naverItem.mapy),
    phone: naverItem.telephone,
  }
}

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&')
}
```

---

## DB 스키마

```sql
CREATE TABLE restaurants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naver_place_id  TEXT UNIQUE,
  name            TEXT NOT NULL,
  address         TEXT,
  category        TEXT,
  lat             FLOAT,
  lng             FLOAT,
  phone           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: 모든 사용자 조회 가능, 인증 사용자만 생성 가능
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "맛집 조회 전체 허용" ON restaurants FOR SELECT USING (true);
CREATE POLICY "인증 사용자만 맛집 등록" ON restaurants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

---

## 외부 API 프록시

```js
// Vercel API Route: /api/search-place.js
export default async function handler(req, res) {
  const { query } = req.query
  const response = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
      },
    }
  )
  const data = await response.json()
  res.json(data)
}
```

---

## 컴포넌트 구조

```
domains/restaurant/
├── components/
│   ├── RestaurantSearchInput.jsx    # 검색 인풋 + 자동완성
│   ├── RestaurantSearchResult.jsx   # 검색 결과 아이템
│   └── NaverMap.jsx                 # 지도 렌더링
├── hooks/
│   └── useRestaurantSearch.js       # 검색 API 훅 (debounce 300ms)
├── services/
│   ├── naverPlaceAdapter.js         # ACL: 네이버 → 도메인 변환
│   └── restaurantRepository.js      # Supabase CRUD
└── value-objects/
    └── Location.js                  # 좌표 값 객체
```

---

## 불변 규칙 (Invariants)

- `naver_place_id` UNIQUE 제약 → 동일 맛집 중복 등록 방지
- 좌표 변환은 반드시 `Location.fromNaverKatech()` 사용
- HTML 엔티티 제거 후 저장 (`&amp;` → `&`)
- 검색은 debounce 300ms 적용
