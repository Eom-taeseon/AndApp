// 개발용 목 데이터 — Supabase 연결 전까지 사용
export const MOCK_USERS = [
  { id: 'u1', email: 'demo@fonsle.kr', nickname: '맛탐험가', profile_image: null, created_at: '2026-03-01' },
  { id: 'u2', email: 'foodie@fonsle.kr', nickname: '폰슐랭마스터', profile_image: null, created_at: '2026-03-02' },
  { id: 'u3', email: 'gourmet@fonsle.kr', nickname: '미식가K', profile_image: null, created_at: '2026-03-03' },
]

export const MOCK_RESTAURANTS = [
  {
    id: 'r1', naver_place_id: 'nv_001', name: '을지로 골목식당',
    address: '서울 중구 을지로3가 295-1', category: '한식',
    lat: 37.5665, lng: 126.9920, phone: '02-2266-0001', created_at: '2026-03-01',
  },
  {
    id: 'r2', naver_place_id: 'nv_002', name: '성수 파스타 바',
    address: '서울 성동구 성수동2가 277-17', category: '양식',
    lat: 37.5445, lng: 127.0567, phone: '02-499-0002', created_at: '2026-03-02',
  },
  {
    id: 'r3', naver_place_id: 'nv_003', name: '연남동 라멘집',
    address: '서울 마포구 연남동 239-44', category: '일식',
    lat: 37.5662, lng: 126.9245, phone: '02-332-0003', created_at: '2026-03-02',
  },
  {
    id: 'r4', naver_place_id: 'nv_004', name: '광장시장 녹두빈대떡',
    address: '서울 종로구 예지동 6-1', category: '한식',
    lat: 37.5702, lng: 126.9990, phone: '02-2267-0004', created_at: '2026-03-03',
  },
  {
    id: 'r5', naver_place_id: 'nv_005', name: '합정 브런치 카페',
    address: '서울 마포구 합정동 357-1', category: '카페',
    lat: 37.5496, lng: 126.9134, phone: '02-333-0005', created_at: '2026-03-03',
  },
]

export const MOCK_REVIEWS = [
  {
    id: 'rv1', user_id: 'u1', restaurant_id: 'r1',
    score_taste: 4.5, score_value: 5.0, score_atmosphere: 3.0,
    score_service: 3.5, score_decoration: 2.5, score_access: 4.0,
    content: '을지로 감성이 물씬 나는 골목식당! 가성비가 미쳤고 맛도 훌륭합니다. 분위기는 약간 허름하지만 그게 매력이에요.',
    visited_at: '2026-03-05', created_at: '2026-03-05T12:00:00Z',
  },
  {
    id: 'rv2', user_id: 'u2', restaurant_id: 'r2',
    score_taste: 4.0, score_value: 3.0, score_atmosphere: 5.0,
    score_service: 4.5, score_decoration: 5.0, score_access: 3.5,
    content: '성수동 분위기 맛집. 인테리어가 정말 예쁘고 파스타도 맛있어요. 다만 가격이 좀 있는 편.',
    visited_at: '2026-03-06', created_at: '2026-03-06T18:30:00Z',
  },
  {
    id: 'rv3', user_id: 'u3', restaurant_id: 'r3',
    score_taste: 5.0, score_value: 4.0, score_atmosphere: 4.0,
    score_service: 3.5, score_decoration: 3.5, score_access: 4.5,
    content: '돈코츠 라멘이 진짜 일본 현지 맛! 면 경도도 선택 가능하고 국물이 깊어요.',
    visited_at: '2026-03-07', created_at: '2026-03-07T13:15:00Z',
  },
  {
    id: 'rv4', user_id: 'u1', restaurant_id: 'r4',
    score_taste: 4.5, score_value: 5.0, score_atmosphere: 3.5,
    score_service: 4.0, score_decoration: 2.0, score_access: 5.0,
    content: '광장시장 녹두빈대떡의 정석. 바삭하고 고소해요. 줄이 좀 있지만 회전이 빨라서 금방 먹을 수 있어요.',
    visited_at: '2026-03-08', created_at: '2026-03-08T11:00:00Z',
  },
  {
    id: 'rv5', user_id: 'u2', restaurant_id: 'r5',
    score_taste: 3.5, score_value: 2.5, score_atmosphere: 5.0,
    score_service: 4.5, score_decoration: 5.0, score_access: 4.0,
    content: '사진 찍기 좋은 브런치 카페. 에그 베네딕트가 괜찮았어요. 가격은 좀 비싼 편이에요.',
    visited_at: '2026-03-08', created_at: '2026-03-08T15:30:00Z',
  },
  {
    id: 'rv6', user_id: 'u3', restaurant_id: 'r1',
    score_taste: 4.0, score_value: 4.5, score_atmosphere: 3.5,
    score_service: 4.0, score_decoration: 3.0, score_access: 4.0,
    content: '점심 특선이 7000원인데 퀄리티가 미쳤습니다. 직장인 성지.',
    visited_at: '2026-03-09', created_at: '2026-03-09T12:30:00Z',
  },
]

// 리뷰 + 맛집 + 사용자 조합한 피드 아이템 생성
export function getMockFeedItems() {
  return MOCK_REVIEWS
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(review => {
      const restaurant = MOCK_RESTAURANTS.find(r => r.id === review.restaurant_id)
      const user = MOCK_USERS.find(u => u.id === review.user_id)
      const totalScore = +(
        (review.score_taste + review.score_value + review.score_atmosphere +
         review.score_service + review.score_decoration + review.score_access) / 6
      ).toFixed(2)
      return { ...review, restaurant, user, totalScore }
    })
}

// 맛집별 평균 점수 계산
export function getMockRestaurantAvg(restaurantId) {
  const reviews = MOCK_REVIEWS.filter(r => r.restaurant_id === restaurantId)
  if (reviews.length === 0) return null
  const keys = ['score_taste', 'score_value', 'score_atmosphere', 'score_service', 'score_decoration', 'score_access']
  const avg = {}
  keys.forEach(k => {
    avg[k] = +(reviews.reduce((sum, r) => sum + r[k], 0) / reviews.length).toFixed(1)
  })
  avg.total = +(keys.reduce((sum, k) => sum + avg[k], 0) / 6).toFixed(2)
  avg.count = reviews.length
  return avg
}
