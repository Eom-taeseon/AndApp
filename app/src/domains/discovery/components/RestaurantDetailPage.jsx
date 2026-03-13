import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getRestaurant } from '../../restaurant/services/restaurantRepository'
import { getReviewsByRestaurant, getRestaurantAvgScores } from '../../review/services/reviewRepository'
import { SCORE_DIMENSIONS } from '../../../shared/types/score'
import ReviewRadarChart from '../../visualization/components/ReviewRadarChart'
import ReviewCard from '../../review/components/ReviewCard'
import TopHeader from '../../../shared/components/TopHeader'

export default function RestaurantDetailPage() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [reviews, setReviews] = useState([])
  const [avgScores, setAvgScores] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [rest, revs, avg] = await Promise.all([
          getRestaurant(id),
          getReviewsByRestaurant(id),
          getRestaurantAvgScores(id),
        ])
        setRestaurant(rest)
        // ReviewCard가 기대하는 형태로 변환
        const formattedReviews = revs.map(r => {
          const totalScore = +(
            (Number(r.score_taste) + Number(r.score_value) + Number(r.score_atmosphere) +
             Number(r.score_service) + Number(r.score_visual) + Number(r.score_access)) / 6
          ).toFixed(2)
          return { ...r, restaurant: rest, totalScore }
        })
        setReviews(formattedReviews)
        setAvgScores(avg)
      } catch (err) {
        console.error('맛집 상세 로딩 실패:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <TopHeader title="맛집 상세" showBack />
        <p className="text-sm" style={{ color: 'var(--sub)' }}>불러오는 중...</p>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="py-20 text-center">
        <TopHeader title="맛집 상세" showBack />
        <p style={{ color: 'var(--sub)' }}>맛집을 찾을 수 없습니다</p>
      </div>
    )
  }

  // 평균 점수를 레이더 차트용으로 변환
  const avgRadarScores = avgScores ? {
    taste: avgScores.score_taste,
    value: avgScores.score_value,
    atmosphere: avgScores.score_atmosphere,
    service: avgScores.score_service,
    visual: avgScores.score_visual,
    access: avgScores.score_access,
  } : null

  const totalAvg = avgScores
    ? +((avgScores.score_taste + avgScores.score_value + avgScores.score_atmosphere +
         avgScores.score_service + avgScores.score_visual + avgScores.score_access) / 6).toFixed(1)
    : null

  return (
    <div className="pb-24">
      <TopHeader title={restaurant.name} showBack />

      <div className="px-4 space-y-5 mt-4">
        {/* 기본 정보 */}
        <section className="bg-white rounded-2xl p-5"
          style={{ border: '1px solid var(--border)' }}>
          <h2 className="text-xl font-bold mb-1">{restaurant.name}</h2>
          <p className="text-sm" style={{ color: 'var(--sub)' }}>
            {restaurant.category} · {restaurant.address}
          </p>
          {restaurant.phone && (
            <p className="text-sm mt-1" style={{ color: 'var(--sub)' }}>
              📞 {restaurant.phone}
            </p>
          )}
        </section>

        {/* 평균 레이더 차트 */}
        {avgRadarScores && (
          <section className="bg-white rounded-2xl p-5"
            style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">평균 평점</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                  {totalAvg}
                </span>
                <span className="text-xs" style={{ color: 'var(--sub)' }}>
                  / 5.0 ({avgScores.review_count}개 리뷰)
                </span>
              </div>
            </div>
            <ReviewRadarChart scores={avgRadarScores} size={280} showScore />

            {/* 항목별 점수 바 */}
            <div className="mt-4 space-y-2">
              {SCORE_DIMENSIONS.map(d => {
                const val = avgRadarScores[d.key]
                return (
                  <div key={d.key} className="flex items-center gap-2">
                    <span className="text-xs w-16" style={{ color: 'var(--sub)' }}>
                      {d.icon} {d.label}
                    </span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--border)' }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${(val / 5) * 100}%`, background: 'var(--primary)' }} />
                    </div>
                    <span className="text-xs font-bold w-8 text-right">{val.toFixed(1)}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 리뷰 목록 */}
        <section>
          <h3 className="font-bold mb-3">리뷰 ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--sub)' }}>
              아직 리뷰가 없어요
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
