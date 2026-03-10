import { useState, useEffect } from 'react'
import { getReviewFeed } from '../../review/services/reviewRepository'
import ReviewCard from '../../review/components/ReviewCard'

export default function FeedPage() {
  const [feedItems, setFeedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(5)

  useEffect(() => {
    getReviewFeed({ limit: 50 })
      .then(data => {
        // 조인된 데이터를 ReviewCard가 기대하는 형태로 변환
        const items = data.map(review => {
          const totalScore = +(
            (Number(review.score_taste) + Number(review.score_value) +
             Number(review.score_atmosphere) + Number(review.score_service) +
             Number(review.score_decoration) + Number(review.score_access)) / 6
          ).toFixed(2)
          return { ...review, totalScore }
        })
        setFeedItems(items)
      })
      .catch(err => console.error('피드 로딩 실패:', err))
      .finally(() => setLoading(false))
  }, [])

  const visibleItems = feedItems.slice(0, visibleCount)
  const hasMore = visibleCount < feedItems.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <span className="text-3xl block mb-2">🍽️</span>
          <p className="text-sm" style={{ color: 'var(--sub)' }}>맛있는 리뷰를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-24 space-y-4">
      {/* 히어로 배너 */}
      <div className="rounded-2xl p-5 text-center"
        style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
        <h2 className="text-white font-bold text-lg mb-1">
          나만의 맛집을 6각형으로
        </h2>
        <p className="text-white/80 text-xs">
          맛 · 가성비 · 분위기 · 서비스 · 데코 · 접근성
        </p>
      </div>

      {/* 최신 리뷰 섹션 */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base">최신 리뷰</h2>
        <span className="text-xs" style={{ color: 'var(--sub)' }}>
          총 {feedItems.length}개
        </span>
      </div>

      {feedItems.length === 0 ? (
        <div className="py-12 text-center">
          <span className="text-3xl block mb-2">✏️</span>
          <p className="text-sm" style={{ color: 'var(--sub)' }}>
            아직 리뷰가 없어요. 첫 리뷰를 작성해보세요!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visibleItems.map(item => (
              <ReviewCard key={item.id} review={item} />
            ))}
          </div>

          {hasMore && (
            <button
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="w-full py-3 rounded-xl text-sm font-medium
                transition-all hover:opacity-80"
              style={{ color: 'var(--primary)', background: 'var(--bg)',
                border: '1px solid var(--primary)' }}
            >
              더 보기
            </button>
          )}
        </>
      )}
    </div>
  )
}
