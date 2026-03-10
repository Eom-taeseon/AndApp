import { useState, useCallback } from 'react'
import { SCORE_DIMENSIONS, SCORE_MIN } from '../../../shared/types/score'

// 리뷰 폼 상태 관리 훅
export function useReviewForm() {
  const initialScores = {}
  SCORE_DIMENSIONS.forEach(d => { initialScores[d.key] = 3.0 })

  const [scores, setScores] = useState(initialScores)
  const [content, setContent] = useState('')
  const [visitedAt, setVisitedAt] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [restaurant, setRestaurant] = useState(null)

  const updateScore = useCallback((key, value) => {
    setScores(prev => ({ ...prev, [key]: value }))
  }, [])

  const totalScore = (() => {
    const values = SCORE_DIMENSIONS.map(d => scores[d.key] || 0)
    const sum = values.reduce((a, b) => a + b, 0)
    return +(sum / SCORE_DIMENSIONS.length).toFixed(2)
  })()

  const isValid = SCORE_DIMENSIONS.every(d => scores[d.key] >= SCORE_MIN)
    && restaurant !== null
    && content.trim().length > 0

  const reset = useCallback(() => {
    const fresh = {}
    SCORE_DIMENSIONS.forEach(d => { fresh[d.key] = 3.0 })
    setScores(fresh)
    setContent('')
    setVisitedAt(new Date().toISOString().split('T')[0])
    setRestaurant(null)
  }, [])

  return {
    scores, updateScore,
    content, setContent,
    visitedAt, setVisitedAt,
    restaurant, setRestaurant,
    totalScore, isValid, reset,
  }
}
