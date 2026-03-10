import { useRef, useCallback } from 'react'
import { SCORE_MIN, SCORE_MAX, SCORE_STEP } from '../../../shared/types/score'

// 단일 항목 별점 입력 — 터치 최적화
export default function ScoreInput({ dimension, value, onChange }) {
  const trackRef = useRef(null)

  // 터치/마우스 위치에서 점수 계산 (range input 대신 직접 처리)
  const calcScore = useCallback((clientX) => {
    const track = trackRef.current
    if (!track) return value
    const rect = track.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const raw = SCORE_MIN + ratio * (SCORE_MAX - SCORE_MIN)
    // 0.5 단위로 반올림
    return Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(raw / SCORE_STEP) * SCORE_STEP))
  }, [value])

  const handlePointerDown = useCallback((e) => {
    e.preventDefault() // 키보드 올라오는 것 방지
    const score = calcScore(e.clientX || e.touches?.[0]?.clientX)
    onChange(score)

    const handleMove = (ev) => {
      ev.preventDefault()
      const x = ev.clientX || ev.touches?.[0]?.clientX
      if (x !== undefined) onChange(calcScore(x))
    }
    const handleEnd = () => {
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handleEnd)
    }
    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerup', handleEnd)
  }, [calcScore, onChange])

  const fillPercent = ((value - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100

  return (
    <div className="flex items-center gap-3 py-2.5 select-none touch-none">
      <div className="flex items-center gap-1.5 min-w-[80px]">
        <span className="text-base">{dimension.icon}</span>
        <span className="text-sm font-medium">{dimension.label}</span>
      </div>

      {/* 커스텀 슬라이더 트랙 (input 대신 div 사용 → 키보드 안 뜸) */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="flex-1 h-8 flex items-center cursor-pointer"
        role="slider"
        aria-label={`${dimension.label} 점수`}
        aria-valuemin={SCORE_MIN}
        aria-valuemax={SCORE_MAX}
        aria-valuenow={value}
        tabIndex={-1}
      >
        <div className="w-full h-2 rounded-full relative"
          style={{ background: 'var(--border)' }}>
          {/* 채워진 부분 */}
          <div className="h-full rounded-full transition-[width] duration-75"
            style={{ width: `${fillPercent}%`, background: 'var(--primary)' }} />
          {/* 썸(thumb) */}
          <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
            shadow-md transition-[left] duration-75"
            style={{
              left: `calc(${fillPercent}% - 10px)`,
              background: 'var(--primary)',
              border: '3px solid white',
            }} />
        </div>
      </div>

      <span className="text-sm font-bold min-w-[32px] text-right"
        style={{ color: 'var(--primary)' }}>
        {value.toFixed(1)}
      </span>
    </div>
  )
}
