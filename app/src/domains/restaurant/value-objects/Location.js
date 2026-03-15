/**
 * 좌표 값 객체 — 네이버 카텍(Katech) 좌표를 WGS84로 변환
 */
export class Location {
  constructor(lat, lng) {
    this.lat = lat
    this.lng = lng
  }

  static fromNaverKatech(mapx, mapy) {
    const lat = parseInt(mapy) / 1e7
    const lng = parseInt(mapx) / 1e7
    if (Number.isNaN(lat) || Number.isNaN(lng)) return new Location(null, null)
    return new Location(lat, lng)
  }
}
