import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchRestaurants, getAllRestaurants } from '../../restaurant/services/restaurantRepository'
import { getRestaurantAvgScores } from '../../review/services/reviewRepository'
import MiniRadarChart from '../../visualization/components/MiniRadarChart'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [avgMap, setAvgMap] = useState({}) // { restaurantId: avgScores }
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // 초기 전체 목록 로딩
  useEffect(() => {
    getAllRestaurants()
      .then(async (restaurants) => {
        setResults(restaurants)
        // 각 맛집의 평균 점수 로딩
        const map = {}
        await Promise.all(
          restaurants.map(async (r) => {
            const avg = await getRestaurantAvgScores(r.id)
            if (avg) map[r.id] = avg
          })
        )
        setAvgMap(map)
      })
      .catch(err => console.error('맛집 목록 로딩 실패:', err))
      .finally(() => setLoading(false))
  }, [])

  // 검색 (디바운스)
  useEffect(() => {
    if (!query.trim()) {
      getAllRestaurants().then(setResults)
      return
    }

    const timer = setTimeout(() => {
      searchRestaurants(query).then(setResults)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm" style={{ color: 'var(--sub)' }}>맛집 목록 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-24 space-y-4">
      {/* 검색 바 */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="맛집 이름, 카테고리, 주소로 검색"
          className="w-full px-4 py-3 pl-10 rounded-xl text-sm outline-none
            transition-all focus:ring-2 focus:ring-[var(--primary)]/30"
          style={{ background: 'white', border: '1px solid var(--border)' }}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">🔍</span>
      </div>

      {/* 결과 목록 */}
      <div className="space-y-3">
        {results.map(r => {
          const avg = avgMap[r.id]
          const avgScores = avg ? {
            taste: avg.score_taste, value: avg.score_value,
            atmosphere: avg.score_atmosphere, service: avg.score_service,
            visual: avg.score_visual, access: avg.score_access,
          } : null

          const totalScore = avg
            ? +((avg.score_taste + avg.score_value + avg.score_atmosphere +
                 avg.score_service + avg.score_visual + avg.score_access) / 6).toFixed(1)
            : null

          return (
            <article
              key={r.id}
              className="bg-white rounded-2xl p-4 flex gap-3 cursor-pointer
                transition-all hover:shadow-md active:scale-[0.98]"
              style={{ border: '1px solid var(--border)' }}
              onClick={() => navigate(`/restaurant/${r.id}`)}
            >
              {avgScores && (
                <div className="shrink-0 w-[100px] h-[100px]">
                  <MiniRadarChart scores={avgScores} size={100} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm">{r.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--sub)' }}>
                  {r.category}
                </p>
                <p className="text-xs" style={{ color: 'var(--sub)' }}>
                  {r.address}
                </p>
                {totalScore && (
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                      {totalScore}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--sub)' }}>
                      ({avg.review_count}개 리뷰)
                    </span>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {results.length === 0 && query && (
        <div className="py-12 text-center">
          <span className="text-3xl mb-3 block">🍽️</span>
          <p className="text-sm" style={{ color: 'var(--sub)' }}>
            "{query}"에 해당하는 맛집이 없습니다
          </p>
        </div>
      )}
    </div>
  )
}
