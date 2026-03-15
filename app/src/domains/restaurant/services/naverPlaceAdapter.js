import { Location } from '../value-objects/Location'

/**
 * ACL: 네이버 검색 API 응답 → Restaurant 도메인 모델 변환
 */
export function toRestaurant(naverItem) {
  const location = Location.fromNaverKatech(naverItem.mapx, naverItem.mapy)
  return {
    naverPlaceId: extractPlaceId(naverItem.link),
    name: stripHtml(naverItem.title),
    address: naverItem.roadAddress || naverItem.address,
    category: naverItem.category,
    lat: location.lat,
    lng: location.lng,
    phone: naverItem.telephone || null,
  }
}

function extractPlaceId(link) {
  if (!link) return null
  const match = link.match(/place\/(\d+)/)
  return match ? match[1] : link
}

function stripHtml(str) {
  if (!str) return ''
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .trim()
}
