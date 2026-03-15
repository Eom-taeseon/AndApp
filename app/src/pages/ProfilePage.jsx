import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../domains/identity/context/AuthContext'
import { getReviewsByUser } from '../domains/review/services/reviewRepository'
import MiniRadarChart from '../domains/visualization/components/MiniRadarChart'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [myReviews, setMyReviews] = useState([])
  const [loading, setLoading] = useState(!!user)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    getReviewsByUser(user.id)
      .then(data => {
        if (cancelled) return
        const reviews = data.map(r => {
          const totalScore = +(
            (Number(r.score_taste) + Number(r.score_value) + Number(r.score_atmosphere) +
             Number(r.score_service) + Number(r.score_visual) + Number(r.score_access)) / 6
          ).toFixed(2)
          return { ...r, totalScore }
        })
        setMyReviews(reviews)
      })
      .catch(err => { if (!cancelled) console.error('내 리뷰 로딩 실패:', err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [user])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <span className="text-5xl mb-4">👤</span>
        <p className="text-lg font-semibold mb-2">로그인이 필요합니다</p>
        <button
          onClick={() => navigate('/auth')}
          className="px-6 py-3 rounded-xl text-white font-semibold text-sm mt-4"
          style={{ background: 'var(--primary)' }}
        >
          로그인하러 가기
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pb-24 space-y-5">
      {/* 프로필 카드 */}
      <section className="bg-white rounded-2xl p-5 text-center"
        style={{ border: '1px solid var(--border)' }}>
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl"
          style={{ background: 'var(--primary)', color: 'white' }}>
          {user.nickname?.[0] || '?'}
        </div>
        <h2 className="font-bold text-lg mt-3">{user.nickname}</h2>
        <p className="text-xs" style={{ color: 'var(--sub)' }}>{user.email}</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
              {myReviews.length}
            </p>
            <p className="text-xs" style={{ color: 'var(--sub)' }}>리뷰</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
              {new Set(myReviews.map(r => r.restaurant_id)).size}
            </p>
            <p className="text-xs" style={{ color: 'var(--sub)' }}>맛집</p>
          </div>
        </div>
      </section>

      {/* 내 리뷰 */}
      <section>
        <h3 className="font-bold mb-3">내 리뷰</h3>
        {loading ? (
          <p className="text-sm text-center py-6" style={{ color: 'var(--sub)' }}>
            불러오는 중...
          </p>
        ) : myReviews.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: 'var(--sub)' }}>
            아직 작성한 리뷰가 없어요
          </p>
        ) : (
          <div className="space-y-3">
            {myReviews.map(review => (
              <article
                key={review.id}
                className="bg-white rounded-xl p-4 flex gap-3 cursor-pointer
                  transition-all hover:shadow-sm"
                style={{ border: '1px solid var(--border)' }}
                onClick={() => navigate(`/restaurant/${review.restaurant_id}`)}
              >
                <div className="shrink-0 w-[80px] h-[80px]">
                  <MiniRadarChart scores={{
                    taste: Number(review.score_taste),
                    value: Number(review.score_value),
                    atmosphere: Number(review.score_atmosphere),
                    service: Number(review.score_service),
                    visual: Number(review.score_visual),
                    access: Number(review.score_access),
                  }} size={80} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{review.restaurant?.name}</p>
                  <p className="text-xs" style={{ color: 'var(--sub)' }}>
                    {review.restaurant?.category} · {review.totalScore}점
                  </p>
                  <p className="text-xs mt-1 line-clamp-2">{review.content}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 로그아웃 */}
      <button
        onClick={async () => { await signOut(); navigate('/') }}
        className="w-full py-3 rounded-xl text-sm font-medium"
        style={{ color: 'var(--sub)', border: '1px solid var(--border)' }}
      >
        로그아웃
      </button>
    </div>
  )
}
