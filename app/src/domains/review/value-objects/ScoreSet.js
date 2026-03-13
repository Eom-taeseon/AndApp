import { SCORE_DIMENSIONS, SCORE_MIN, SCORE_MAX, SCORE_STEP } from '../../../shared/types/score'

// 6가지 점수를 하나의 불변 값 객체로 캡슐화
export class ScoreSet {
  constructor({ taste, value, atmosphere, service, visual, access }) {
    this.#validate(taste, value, atmosphere, service, visual, access)
    this.taste = taste
    this.value = value
    this.atmosphere = atmosphere
    this.service = service
    this.visual = visual
    this.access = access
    Object.freeze(this)
  }

  #validate(...scores) {
    scores.forEach(s => {
      if (s < SCORE_MIN || s > SCORE_MAX)
        throw new Error(`점수는 ${SCORE_MIN}~${SCORE_MAX} 범위: ${s}`)
      if ((s * 10) % (SCORE_STEP * 10) !== 0)
        throw new Error(`${SCORE_STEP} 단위만 가능: ${s}`)
    })
  }

  get total() {
    const sum = this.taste + this.value + this.atmosphere
      + this.service + this.visual + this.access
    return +(sum / 6).toFixed(2)
  }

  toArray() {
    return [this.taste, this.value, this.atmosphere,
            this.service, this.visual, this.access]
  }

  toRadarData() {
    return SCORE_DIMENSIONS.map((d, i) => ({
      subject: d.label,
      score: this.toArray()[i],
      fullMark: 5,
    }))
  }

  // DB row 형식에서 ScoreSet 생성
  static fromDbRow(row) {
    return new ScoreSet({
      taste: row.score_taste,
      value: row.score_value,
      atmosphere: row.score_atmosphere,
      service: row.score_service,
      visual: row.score_visual,
      access: row.score_access,
    })
  }

  // 평범한 객체에서 ScoreSet 생성
  static fromObject(obj) {
    return new ScoreSet({
      taste: obj.taste || SCORE_MIN,
      value: obj.value || SCORE_MIN,
      atmosphere: obj.atmosphere || SCORE_MIN,
      service: obj.service || SCORE_MIN,
      visual: obj.visual || SCORE_MIN,
      access: obj.access || SCORE_MIN,
    })
  }
}
