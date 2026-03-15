/**
 * 좌표 값 객체 — 네이버 카텍(Katech) 좌표를 WGS84로 변환
 */
export class Location {
  constructor(lat, lng) {
    this.lat = lat
    this.lng = lng
  }

  static fromNaverKatech(mapx, mapy) {
    return new Location(
      parseInt(mapy) / 1e7,
      parseInt(mapx) / 1e7
    )
  }
}
