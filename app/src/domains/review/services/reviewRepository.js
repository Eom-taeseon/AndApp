import { supabase, isMockMode } from '../../../shared/lib/supabase'
import { MOCK_REVIEWS, MOCK_USERS, MOCK_RESTAURANTS } from '../../../shared/lib/mock-data'

// 리뷰 작성
export async function createReview({ userId, restaurantId, scores, content, visitedAt }) {
  if (isMockMode) {
    return {
      id: `rv${Date.now()}`,
      user_id: userId,
      restaurant_id: restaurantId,
      ...scores,
      content,
      visited_at: visitedAt,
      created_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: userId,
      restaurant_id: restaurantId,
      score_taste: scores.score_taste,
      score_value: scores.score_value,
      score_atmosphere: scores.score_atmosphere,
      score_service: scores.score_service,
      score_visual: scores.score_visual,
      score_access: scores.score_access,
      content,
      visited_at: visitedAt,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// 최신 리뷰 피드 (유저+맛집 정보 조인)
export async function getReviewFeed({ limit = 20, offset = 0 } = {}) {
  if (isMockMode) {
    return MOCK_REVIEWS.map(r => ({
      ...r,
      user: MOCK_USERS.find(u => u.id === r.user_id),
      restaurant: MOCK_RESTAURANTS.find(rest => rest.id === r.restaurant_id),
    }))
  }

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:users(id, nickname, profile_image),
      restaurant:restaurants(id, name, category, address)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

// 특정 맛집의 리뷰 목록
export async function getReviewsByRestaurant(restaurantId) {
  if (isMockMode) {
    return MOCK_REVIEWS
      .filter(r => r.restaurant_id === restaurantId)
      .map(r => ({
        ...r,
        user: MOCK_USERS.find(u => u.id === r.user_id),
      }))
  }

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:users(id, nickname, profile_image)
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 특정 사용자의 리뷰 목록
export async function getReviewsByUser(userId) {
  if (isMockMode) {
    return MOCK_REVIEWS
      .filter(r => r.user_id === userId)
      .map(r => ({
        ...r,
        restaurant: MOCK_RESTAURANTS.find(rest => rest.id === r.restaurant_id),
      }))
  }

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      restaurant:restaurants(id, name, category, address)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 맛집 평균 점수 계산
export async function getRestaurantAvgScores(restaurantId) {
  if (isMockMode) {
    const reviews = MOCK_REVIEWS.filter(r => r.restaurant_id === restaurantId)
    if (reviews.length === 0) return null

    const avg = (key) =>
      +(reviews.reduce((sum, r) => sum + r[key], 0) / reviews.length).toFixed(1)

    return {
      score_taste: avg('score_taste'),
      score_value: avg('score_value'),
      score_atmosphere: avg('score_atmosphere'),
      score_service: avg('score_service'),
      score_visual: avg('score_visual'),
      score_access: avg('score_access'),
      review_count: reviews.length,
    }
  }

  const { data, error } = await supabase
    .rpc('get_restaurant_avg_scores', { target_restaurant_id: restaurantId })

  if (error) {
    // RPC가 없으면 클라이언트에서 직접 계산 (폴백)
    const { data: reviews } = await supabase
      .from('reviews')
      .select('score_taste, score_value, score_atmosphere, score_service, score_visual, score_access')
      .eq('restaurant_id', restaurantId)

    if (!reviews || reviews.length === 0) return null

    const avg = (key) =>
      +(reviews.reduce((sum, r) => sum + Number(r[key]), 0) / reviews.length).toFixed(1)

    return {
      score_taste: avg('score_taste'),
      score_value: avg('score_value'),
      score_atmosphere: avg('score_atmosphere'),
      score_service: avg('score_service'),
      score_visual: avg('score_visual'),
      score_access: avg('score_access'),
      review_count: reviews.length,
    }
  }

  return data
}

// 리뷰 삭제
export async function deleteReview(reviewId) {
  if (isMockMode) return true

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) throw error
  return true
}
