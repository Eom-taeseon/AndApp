import ReviewRadarChart from './ReviewRadarChart'
import { COLORS } from '../../../shared/types/tokens'

// 리뷰 작성 시 실시간 레이더 미리보기
export default function LiveRadarPreview({ scores, size = 220 }) {
  return (
    <div className="flex flex-col items-center">
      <ReviewRadarChart
        scores={scores}
        size={size}
        color={COLORS.purple}
        showLabel={true}
        showScore={true}
      />
      <p className="text-xs mt-1" style={{ color: 'var(--sub)' }}>
        점수를 조정하면 실시간으로 반영됩니다
      </p>
    </div>
  )
}
