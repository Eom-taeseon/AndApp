import { useState, useEffect, useRef } from 'react'
import { useRestaurantSearch } from '../hooks/useRestaurantSearch'

export default function RestaurantSearchInput({ selected, onSelect }) {
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const wrapperRef = useRef(null)
  const { results, loading, error } = useRestaurantSearch(query)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 결과가 있으면 드롭다운 표시
  useEffect(() => {
    if (results.length > 0) setShowResults(true)
  }, [results])

  if (selected) {
    return (
      <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3"
        style={{ border: '1px solid var(--primary)' }}>
        <div>
          <p className="text-sm font-semibold">{selected.name}</p>
          <p className="text-xs" style={{ color: 'var(--sub)' }}>{selected.category} · {selected.address}</p>
        </div>
        <button
          type="button"
          onClick={() => { onSelect(null); setQuery('') }}
          className="text-xs px-3 py-1 rounded-lg"
          style={{ color: 'var(--primary)', background: 'var(--bg)' }}
        >
          변경
        </button>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowResults(true)}
        placeholder="맛집 이름을 검색하세요"
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
          focus:ring-2 focus:ring-[var(--primary)]/30"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
      />

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {showResults && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl
          shadow-lg overflow-hidden z-30 max-h-60 overflow-y-auto"
          style={{ border: '1px solid var(--border)' }}>
          {results.map((r, i) => (
            <li key={r.naverPlaceId || r.id || i}>
              <button
                type="button"
                onClick={() => { onSelect(r); setShowResults(false); setQuery(r.name) }}
                className="w-full text-left px-4 py-3 hover:bg-[var(--bg)] transition-colors"
              >
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs" style={{ color: 'var(--sub)' }}>
                  {r.category} · {r.address}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {showResults && query.trim() && !loading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl
          shadow-lg p-4 text-center z-30"
          style={{ border: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--sub)' }}>
            {error || '검색 결과가 없습니다'}
          </p>
        </div>
      )}
    </div>
  )
}
