import { useState, useEffect, useCallback } from 'react'
import { toRestaurant } from '../services/naverPlaceAdapter'
import { isMockMode } from '../../../shared/lib/supabase'
import { MOCK_RESTAURANTS } from '../../../shared/lib/mock-data'

/**
 * 맛집 검색 훅 — 네이버 API 프록시 호출 (debounce 300ms)
 * Mock 모드에서는 로컬 목 데이터로 필터링
 */
export function useRestaurantSearch(query) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query || query.trim().length < 1) {
      setResults([])
      setError(null)
      return
    }

    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        if (isMockMode) {
          const q = query.toLowerCase()
          const filtered = MOCK_RESTAURANTS.filter(r =>
            r.name.toLowerCase().includes(q) || r.category?.toLowerCase().includes(q) || r.address?.toLowerCase().includes(q)
          )
          if (!cancelled) setResults(filtered)
        } else {
          const res = await fetch(`/api/search-place?query=${encodeURIComponent(query)}`)
          if (!res.ok) throw new Error('검색 요청 실패')
          const data = await res.json()
          const restaurants = (data.items || []).map(toRestaurant)
          if (!cancelled) setResults(restaurants)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  const reset = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return { results, loading, error, reset }
}
