import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SCORE_DIMENSIONS } from '../../../shared/types/score'
import { useAuth } from '../../identity/context/AuthContext'
import { useReviewForm } from '../hooks/useReviewForm'
import { createReview } from '../services/reviewRepository'
import { upsertRestaurant } from '../../restaurant/services/restaurantRepository'
import ScoreInput from './ScoreInput'
import LiveRadarPreview from '../../visualization/components/LiveRadarPreview'
import RestaurantSearchInput from '../../restaurant/components/RestaurantSearchInput'

export default function ReviewForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const form = useReviewForm()
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(0) // 0: 맛집/날짜, 1: 점수, 2: 후기
  const [submitError, setSubmitError] = useState(null)

  // 비로그인 시 인증 페이지로
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <p className="text-lg font-semibold mb-2">로그인이 필요합니다</p>
        <p className="text-sm mb-6" style={{ color: 'var(--sub)' }}>
          리뷰를 작성하려면 먼저 로그인해주세요
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="px-6 py-3 rounded-xl text-white font-semibold text-sm"
          style={{ background: 'var(--primary)' }}
        >
          로그인하러 가기
        </button>
      </div>
    )
  }

  const handleSubmit = async () => {
    try {
      setSubmitError(null)

      // 맛집이 DB에 없으면 먼저 등록
      const restaurant = await upsertRestaurant(form.restaurant)

      // 리뷰 저장
      await createReview({
        userId: user.id,
        restaurantId: restaurant.id,
        scores: {
          score_taste: form.scores.taste,
          score_value: form.scores.value,
          score_atmosphere: form.scores.atmosphere,
          score_service: form.scores.service,
          score_visual: form.scores.visual,
          score_access: form.scores.access,
        },
        content: form.content,
        visitedAt: form.visitedAt || null,
      })

      setSubmitted(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      console.error('리뷰 등록 실패:', err)
      setSubmitError(err.message || '리뷰 등록에 실패했습니다.')
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="text-5xl mb-4">🎉</span>
        <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
          리뷰가 등록되었습니다!
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--sub)' }}>
          홈으로 이동합니다...
        </p>
      </div>
    )
  }

  // 단계별 진행 표시
  const steps = ['맛집 선택', '점수 입력', '후기 작성']

  return (
    <div className="px-4 pb-28">
      {/* 단계 인디케이터 */}
      <div className="flex items-center gap-2 mb-6 px-2">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className="flex items-center gap-1.5"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              transition-colors ${i <= step
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--border)] text-[var(--sub)]'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:inline
              ${i === step ? 'text-[var(--primary)]' : 'text-[var(--sub)]'}`}>
              {s}
            </span>
            {i < steps.length - 1 && (
              <div className="w-6 h-0.5 mx-1"
                style={{ background: i < step ? 'var(--primary)' : 'var(--border)' }} />
            )}
          </button>
        ))}
      </div>

      {/* Step 0: 맛집 선택 + 방문 날짜 */}
      {step === 0 && (
        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold mb-2">어떤 맛집을 다녀왔나요?</h3>
            <RestaurantSearchInput
              selected={form.restaurant}
              onSelect={form.setRestaurant}
            />
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2">방문 날짜</h3>
            <input
              type="date"
              value={form.visitedAt}
              onChange={e => form.setVisitedAt(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            />
          </section>

          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={!form.restaurant}
            className="w-full py-4 rounded-xl text-white font-bold text-base
              transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: 'var(--primary)' }}
          >
            다음: 점수 입력
          </button>
        </div>
      )}

      {/* Step 1: 점수 입력 + 레이더 미리보기 */}
      {step === 1 && (
        <div className="space-y-5">
          {/* 레이더 차트 먼저 보여주기 (실시간 반영) */}
          <section className="bg-white rounded-2xl p-4"
            style={{ border: '1px solid var(--border)' }}>
            <LiveRadarPreview scores={form.scores} size={200} />
          </section>

          {/* 6항목 점수 슬라이더 */}
          <section>
            <div className="bg-white rounded-2xl p-4 space-y-0"
              style={{ border: '1px solid var(--border)' }}>
              {SCORE_DIMENSIONS.map(dim => (
                <ScoreInput
                  key={dim.key}
                  dimension={dim}
                  value={form.scores[dim.key]}
                  onChange={val => form.updateScore(dim.key, val)}
                />
              ))}
            </div>

            {/* 종합점수 */}
            <div className="flex items-center justify-between mt-3 px-2">
              <span className="text-sm font-medium" style={{ color: 'var(--sub)' }}>
                종합점수
              </span>
              <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
                {form.totalScore.toFixed(1)}
              </span>
            </div>
          </section>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex-1 py-4 rounded-xl font-bold text-sm"
              style={{ color: 'var(--sub)', border: '1px solid var(--border)' }}
            >
              이전
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-[2] py-4 rounded-xl text-white font-bold text-base
                transition-all hover:opacity-90"
              style={{ background: 'var(--primary)' }}
            >
              다음: 후기 작성
            </button>
          </div>
        </div>
      )}

      {/* Step 2: 텍스트 후기 + 제출 */}
      {step === 2 && (
        <div className="space-y-5">
          {/* 선택한 맛집 요약 */}
          <div className="bg-white rounded-xl p-3 flex items-center gap-3"
            style={{ border: '1px solid var(--border)' }}>
            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: 'var(--bg)' }}>
              🍽️
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{form.restaurant?.name}</p>
              <p className="text-xs" style={{ color: 'var(--sub)' }}>
                종합 {form.totalScore.toFixed(1)}점
              </p>
            </div>
          </div>

          <section>
            <h3 className="text-sm font-semibold mb-2">한 줄 리뷰</h3>
            <textarea
              value={form.content}
              onChange={e => form.setContent(e.target.value)}
              placeholder="이 맛집의 매력을 자유롭게 적어주세요..."
              rows={5}
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none
                focus:ring-2 focus:ring-[var(--primary)]/30"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            />
            <p className="text-xs text-right mt-1" style={{ color: 'var(--sub)' }}>
              {form.content.length}자
            </p>
          </section>

          {submitError && (
            <p className="text-sm text-red-500 text-center">{submitError}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-4 rounded-xl font-bold text-sm"
              style={{ color: 'var(--sub)', border: '1px solid var(--border)' }}
            >
              이전
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!form.isValid}
              className="flex-[2] py-4 rounded-xl text-white font-bold text-base
                transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--primary)' }}
            >
              리뷰 등록하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
