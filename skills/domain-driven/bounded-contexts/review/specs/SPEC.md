# ⭐ Review Context (Core Domain) — 스펙

> 최종 수정: 2026-03-09
> Context 유형: **Core Domain**
> 담당 Phase: Phase 5

---

## 왜 Core Domain인가

폰슐랭의 핵심 차별점은 "6가지 항목 독립 평가"이다.
이 평가 로직과 데이터 모델이 서비스의 존재 이유이므로 Core Domain으로 분류한다.

---

## 도메인 모델

### Aggregate Root: Review

```
Review (Aggregate Root)
├── id: UUID
├── userId: UUID (Identity Context 참조)
├── restaurantId: UUID (Restaurant Context 참조)
├── scores: ScoreSet (Value Object)
│   ├── taste: Decimal [1.0 ~ 5.0]
│   ├── value: Decimal [1.0 ~ 5.0]
│   ├── atmosphere: Decimal [1.0 ~ 5.0]
│   ├── service: Decimal [1.0 ~ 5.0]
│   ├── visual: Decimal [1.0 ~ 5.0]
│   └── access: Decimal [1.0 ~ 5.0]
├── totalScore: Decimal (Computed, scores 평균)
├── content: String (텍스트 후기)
├── visitedAt: Date (방문 날짜)
├── images: List<ReviewImage> (Entity)
│   ├── id: UUID
│   ├── imageUrl: String
│   └── sortOrder: Int
└── createdAt: DateTime
```

### Value Object: ScoreSet

6가지 점수를 하나의 불변 값 객체로 캡슐화.

```js
// domains/review/value-objects/ScoreSet.js
export class ScoreSet {
  constructor({ taste, value, atmosphere, service, visual, access }) {
    this.#validate(taste, value, atmosphere, service, visual, access)
    this.taste = taste
    this.value = value
    this.atmosphere = atmosphere
    this.service = service
    this.visual = visual
    this.access = access
    Object.freeze(this)
  }

  #validate(...scores) {
    scores.forEach(s => {
      if (s < 1.0 || s > 5.0) throw new Error(`점수는 1.0~5.0 범위: ${s}`)
      if (s % 0.5 !== 0) throw new Error(`0.5 단위만 가능: ${s}`)
    })
  }

  get total() {
    const sum = this.taste + this.value + this.atmosphere
      + this.service + this.visual + this.access
    return +(sum / 6).toFixed(2)
  }

  toArray() {
    return [this.taste, this.value, this.atmosphere,
            this.service, this.visual, this.access]
  }

  toRadarData() {
    return SCORE_DIMENSIONS.map((d, i) => ({
      subject: d.label,
      score: this.toArray()[i],
      fullMark: 5,
    }))
  }
}
```

### 도메인 이벤트

| 이벤트 | 발행 시점 | 소비자 |
|---|---|---|
| ReviewCreated | 리뷰 INSERT 완료 | Discovery (피드 갱신), Visualization (차트 캐시 무효화) |
| ReviewUpdated | 리뷰 수정 | Visualization (차트 재계산) |
| ReviewDeleted | 리뷰 삭제 | Discovery, Visualization |

---

## DB 스키마

```sql
CREATE TABLE reviews (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id       UUID REFERENCES restaurants(id) ON DELETE CASCADE,

  -- 6가지 항목 점수 (1.0 ~ 5.0, 0.5 단위)
  score_taste         NUMERIC(2,1) CHECK (score_taste BETWEEN 1.0 AND 5.0),
  score_value         NUMERIC(2,1) CHECK (score_value BETWEEN 1.0 AND 5.0),
  score_atmosphere    NUMERIC(2,1) CHECK (score_atmosphere BETWEEN 1.0 AND 5.0),
  score_service       NUMERIC(2,1) CHECK (score_service BETWEEN 1.0 AND 5.0),
  score_visual    NUMERIC(2,1) CHECK (score_visual BETWEEN 1.0 AND 5.0),
  score_access        NUMERIC(2,1) CHECK (score_access BETWEEN 1.0 AND 5.0),

  score_total         NUMERIC(3,2) GENERATED ALWAYS AS (
                        (score_taste + score_value + score_atmosphere +
                         score_service + score_visual + score_access) / 6.0
                      ) STORED,

  content             TEXT,
  visited_at          DATE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE review_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id   UUID REFERENCES reviews(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  sort_order  INT DEFAULT 0
);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "리뷰 조회 전체 허용" ON reviews FOR SELECT USING (true);
CREATE POLICY "본인만 리뷰 작성" ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인만 리뷰 수정" ON reviews FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "본인만 리뷰 삭제" ON reviews FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 컴포넌트 구조

```
domains/review/
├── components/
│   ├── ReviewForm.jsx          # 리뷰 작성 폼 전체
│   ├── ScoreInput.jsx          # 단일 항목 별점 입력
│   ├── ScoreSummary.jsx        # 6항목 점수 미리보기
│   ├── ReviewCard.jsx          # 피드/목록용 리뷰 카드
│   └── ReviewDetail.jsx        # 리뷰 상세
├── hooks/
│   └── useReviewForm.js        # 폼 상태 관리 훅
├── services/
│   └── reviewRepository.js     # Supabase CRUD
└── value-objects/
    └── ScoreSet.js             # 6항목 점수 값 객체
```

---

## 불변 규칙 (Invariants)

- 6가지 항목 **모두** 입력해야 리뷰 제출 가능
- 각 항목 점수: 1.0 ~ 5.0, 0.5 단위
- `score_total`은 DB GENERATED COLUMN으로 자동 계산 (프론트에서 계산하지 않음)
- 같은 사용자가 같은 맛집에 여러 리뷰 가능 (방문 날짜 다를 경우)
- 수정/삭제는 본인 리뷰만 (RLS: `user_id = auth.uid()`)
