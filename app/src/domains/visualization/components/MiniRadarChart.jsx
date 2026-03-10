import ReviewRadarChart from './ReviewRadarChart'

// 카드용 소형 레이더 차트 (라벨 없음)
export default function MiniRadarChart({ scores, size = 120 }) {
  return (
    <ReviewRadarChart
      scores={scores}
      size={size}
      showLabel={false}
      showScore={false}
    />
  )
}
