import { useNavigate } from 'react-router-dom'
import MiniRadarChart from '../../visualization/components/MiniRadarChart'
import { formatDate } from '../../../shared/lib/score-utils'

// 피드/목록용 리뷰 카드
export default function ReviewCard({ review }) {
  const navigate = useNavigate()

  const scores = {
    taste: review.score_taste,
    value: review.score_value,
    atmosphere: review.score_atmosphere,
    service: review.score_service,
    decoration: review.score_decoration,
    access: review.score_access,
  }

  return (
    <article
      className="bg-white rounded-2xl p-4 cursor-pointer
        transition-all hover:shadow-md active:scale-[0.98]"
      style={{ border: '1px solid var(--border)' }}
      onClick={() => navigate(`/restaurant/${review.restaurant_id}`)}
    >
      {/* 상단: 유저 + 날짜 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: 'var(--primary)', color: 'white' }}>
            {review.user?.nickname?.[0] || '?'}
          </div>
          <span className="text-sm font-medium">{review.user?.nickname}</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--sub)' }}>
          {formatDate(review.visited_at)}
        </span>
      </div>

      {/* 중간: 가게 이름 + 카테고리 */}
      <div className="mb-3">
        <h3 className="font-bold text-base">{review.restaurant?.name}</h3>
        <span className="text-xs" style={{ color: 'var(--sub)' }}>
          {review.restaurant?.category} · {review.restaurant?.address?.split(' ').slice(0, 3).join(' ')}
        </span>
      </div>

      {/* 하단: 레이더 + 점수 + 리뷰 텍스트 */}
      <div className="flex gap-3">
        <div className="shrink-0 w-[120px] h-[120px]">
          <MiniRadarChart scores={scores} size={120} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
              {review.totalScore?.toFixed(1)}
            </span>
            <span className="text-xs" style={{ color: 'var(--sub)' }}>/5.0</span>
          </div>
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text)' }}>
            {review.content}
          </p>
        </div>
      </div>
    </article>
  )
}
