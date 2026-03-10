import { SCORE_DIMENSIONS } from '../types/score'

// 종합점수 계산
export function calculateTotalScore(scores) {
  const values = SCORE_DIMENSIONS.map(d => scores[d.key] || 0)
  const sum = values.reduce((a, b) => a + b, 0)
  return +(sum / SCORE_DIMENSIONS.length).toFixed(2)
}

// 날짜 포맷팅
export function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

// 별점 텍스트 변환 (예: 4.5 → "★★★★☆")
export function scoreToStars(score) {
  const full = Math.floor(score)
  const half = score % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '☆' : '') + '·'.repeat(empty)
}
