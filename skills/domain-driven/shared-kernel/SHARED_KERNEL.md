# 🔗 Shared Kernel — 공유 핵심 모듈

> 최종 수정: 2026-03-09

---

## 목적

여러 Bounded Context가 공통으로 의존하는 타입, 유틸리티, 인프라 코드를 관리한다.
Shared Kernel 변경 시 모든 Context에 영향이 미치므로 **최소한으로 유지**한다.

---

## Value Objects

### ScoreDimension (평가 항목)

6가지 평가 항목의 열거형. 모든 Context에서 동일한 이름과 순서를 사용한다.

```js
// shared/types/score.js
export const SCORE_DIMENSIONS = [
  { key: 'taste',       label: '음식맛',    icon: '🍴', dbColumn: 'score_taste' },
  { key: 'value',       label: '가성비',    icon: '💰', dbColumn: 'score_value' },
  { key: 'atmosphere',  label: '분위기',    icon: '🌿', dbColumn: 'score_atmosphere' },
  { key: 'service',     label: '서비스',    icon: '🙏', dbColumn: 'score_service' },
  { key: 'visual',      label: '비주얼',    icon: '📸', dbColumn: 'score_visual' },
  { key: 'access',      label: '접근성',    icon: '📍', dbColumn: 'score_access' },
]

export const SCORE_MIN = 1.0
export const SCORE_MAX = 5.0
export const SCORE_STEP = 0.5
```

### 종합점수 계산

```js
// shared/lib/score-utils.js
export function calculateTotalScore(scores) {
  const values = SCORE_DIMENSIONS.map(d => scores[d.key] || 0)
  const sum = values.reduce((a, b) => a + b, 0)
  return +(sum / SCORE_DIMENSIONS.length).toFixed(2)
}
```

---

## Infrastructure

### Supabase 클라이언트

```js
// shared/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## 디자인 토큰

```js
// shared/types/tokens.js
export const COLORS = {
  primary: '#FF6B35',
  primaryLight: '#FF8F5E',
  yellow: '#FFD166',
  purple: '#6C63FF',
  bg: '#FFF5EF',
  text: '#1E1E1E',
  sub: '#999999',
  border: '#F0E8E3',
}
```

---

## 규칙

- Shared Kernel 변경은 **PR 단위로 관리**, Context 담당자 리뷰 필수
- 여기에 비즈니스 로직을 넣지 않는다 (타입·유틸·인프라만)
- Context 간 데이터 전달은 반드시 Shared Kernel의 타입을 사용한다
