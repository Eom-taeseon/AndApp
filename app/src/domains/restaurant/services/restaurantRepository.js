import { supabase, isMockMode } from '../../../shared/lib/supabase'
import { MOCK_RESTAURANTS } from '../../../shared/lib/mock-data'

// 맛집 검색 (이름으로)
export async function searchRestaurants(query) {
  if (isMockMode) {
    const q = query.toLowerCase()
    return MOCK_RESTAURANTS.filter(r =>
      r.name.toLowerCase().includes(q) || r.category?.includes(q)
    )
  }

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(10)

  if (error) throw error
  return data
}

// 맛집 상세 조회
export async function getRestaurant(id) {
  if (isMockMode) {
    return MOCK_RESTAURANTS.find(r => r.id === id) || null
  }

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// 맛집 등록 (리뷰 작성 시 없으면 자동 생성)
// ACL 어댑터는 camelCase(naverPlaceId), DB는 snake_case(naver_place_id) — 양쪽 모두 지원
export async function upsertRestaurant(restaurant) {
  if (isMockMode) {
    return { ...restaurant, id: restaurant.id || `r${Date.now()}` }
  }

  const naverPlaceId = restaurant.naverPlaceId || restaurant.naver_place_id || null

  // naver_place_id가 있으면 중복 방지
  if (naverPlaceId) {
    const { data: existing } = await supabase
      .from('restaurants')
      .select('*')
      .eq('naver_place_id', naverPlaceId)
      .single()

    if (existing) return existing
  }

  const { data, error } = await supabase
    .from('restaurants')
    .insert({
      name: restaurant.name,
      address: restaurant.address,
      category: restaurant.category,
      naver_place_id: naverPlaceId,
      lat: restaurant.lat || null,
      lng: restaurant.lng || null,
      phone: restaurant.phone || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// 전체 맛집 목록 (Discovery용)
export async function getAllRestaurants() {
  if (isMockMode) {
    return MOCK_RESTAURANTS
  }

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
