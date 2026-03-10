import { useState, useEffect, useRef } from 'react'
import { MOCK_RESTAURANTS } from '../../../shared/lib/mock-data'

// 맛집 검색 인풋 + 자동완성 (목 데이터)
export default function RestaurantSearchInput({ selected, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const wrapperRef = useRef(null)

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

  // 검색 (debounce 시뮬레이션)
  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([])
      return
    }
    const timer = setTimeout(() => {
      const filtered = MOCK_RESTAURANTS.filter(r =>
        r.name.includes(query) || r.category.includes(query) || r.address.includes(query)
      )
      setResults(filtered)
      setShowResults(true)
    }, 200)
    return () => clearTimeout(timer)
  }, [query])

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

      {showResults && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl
          shadow-lg overflow-hidden z-30"
          style={{ border: '1px solid var(--border)' }}>
          {results.map(r => (
            <li key={r.id}>
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

      {showResults && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl
          shadow-lg p-4 text-center z-30"
          style={{ border: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--sub)' }}>
            검색 결과가 없습니다
          </p>
        </div>
      )}
    </div>
  )
}
