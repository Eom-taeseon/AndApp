// Shared Kernel — 6가지 평가 항목 정의
export const SCORE_DIMENSIONS = [
  { key: 'taste',       label: '음식맛',    icon: '🍴', dbColumn: 'score_taste' },
  { key: 'value',       label: '가성비',    icon: '💰', dbColumn: 'score_value' },
  { key: 'atmosphere',  label: '분위기',    icon: '🌿', dbColumn: 'score_atmosphere' },
  { key: 'service',     label: '서비스',    icon: '🙏', dbColumn: 'score_service' },
  { key: 'decoration',  label: '비주얼',    icon: '📸', dbColumn: 'score_decoration' },
  { key: 'access',      label: '접근성',    icon: '📍', dbColumn: 'score_access' },
]

export const SCORE_MIN = 1.0
export const SCORE_MAX = 5.0
export const SCORE_STEP = 0.5
