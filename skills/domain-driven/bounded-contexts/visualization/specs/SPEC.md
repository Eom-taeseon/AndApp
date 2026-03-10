# 📊 Visualization Context — 스펙

> 최종 수정: 2026-03-09
> Context 유형: Supporting
> 담당 Phase: Phase 5

---

## 도메인 역할

Review Context의 `ScoreSet`을 **레이더 차트(RadarProfile)**로 시각화하는 단방향 소비자.
자체 비즈니스 로직 없이 Review 데이터의 "표현 계층"에 해당한다.

### Conformist 관계

Visualization은 Review Context의 데이터 형식에 **종속**된다.
ScoreSet이 변경되면 차트도 자동으로 변경되어야 한다.

---

## 레이더 차트 스펙

### Recharts 기반 컴포넌트

```jsx
import {
  RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'

const ReviewRadarChart = ({ scores, size = 300, color = '#FF6B35' }) => {
  const data = scores.toRadarData()  // ScoreSet.toRadarData() 활용

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis domain={[0, 5]} tick={false} />
        <Radar
          dataKey="score"
          fill={color}
          fillOpacity={0.35}
          stroke={color}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
```

### 사용 크기별 가이드

| 위치 | 크기 | 색상 | 라벨 | 용도 |
|---|---|---|---|---|
| 맛집 상세 | 300px | `#FF6B35` (primary) | 한국어 + 점수 | 해당 맛집 평균 점수 |
| 리뷰 카드 | 120px | `#FF6B35` | 없음 (호버 툴팁) | 개별 리뷰 소형 차트 |
| 리뷰 작성 미리보기 | 200px | `#6C63FF` (purple) | 한국어 | 입력 중 실시간 반영 |

---

## 컴포넌트 구조

```
domains/visualization/
└── components/
    ├── ReviewRadarChart.jsx     # 메인 레이더 차트 (크기·색상 props)
    ├── MiniRadarChart.jsx       # 카드용 소형 차트
    └── LiveRadarPreview.jsx     # 리뷰 작성 시 실시간 미리보기
```

---

## 디자인 규칙

- 배경 그리드: 5단계 동심 육각형
- 라벨: 한국어 항목명 (12px 이상)
- 애니메이션: 차트 진입 시 펼쳐지는 효과 (Recharts 기본)
- 점수 없는 항목은 0으로 표시 (null 방지)
- 모바일 최소 터치 영역 44px 확보
