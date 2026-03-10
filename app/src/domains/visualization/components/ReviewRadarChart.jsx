import {
  RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'
import { SCORE_DIMENSIONS } from '../../../shared/types/score'
import { COLORS } from '../../../shared/types/tokens'

// 점수 배열/객체를 레이더 차트 데이터로 변환
function toRadarData(scores) {
  if (scores && typeof scores.toRadarData === 'function') {
    return scores.toRadarData()
  }
  // 일반 객체 또는 DB row 형식
  return SCORE_DIMENSIONS.map(d => ({
    subject: d.label,
    score: scores[d.key] || scores[d.dbColumn] || 0,
    fullMark: 5,
  }))
}

// 메인 레이더 차트 — 크기, 색상 커스텀 가능
export default function ReviewRadarChart({
  scores,
  size = 300,
  color = COLORS.primary,
  showLabel = true,
  showScore = false,
}) {
  const data = toRadarData(scores)

  const renderLabel = showScore
    ? ({ x, y, payload, index }) => (
        <text x={x} y={y} textAnchor="middle" fontSize={11} fill={COLORS.text}>
          <tspan>{payload.value}</tspan>
          <tspan x={x} dy={14} fontSize={10} fill={COLORS.sub}>
            {data[index]?.score || ''}
          </tspan>
        </text>
      )
    : undefined

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RadarChart data={data} cx="50%" cy="50%"
        outerRadius={size * 0.35}>
        <PolarGrid stroke={COLORS.border} />
        {showLabel && (
          <PolarAngleAxis
            dataKey="subject"
            tick={renderLabel || { fontSize: 11, fill: COLORS.text }}
          />
        )}
        <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
        <Radar
          dataKey="score"
          fill={color}
          fillOpacity={0.3}
          stroke={color}
          strokeWidth={2}
          animationDuration={600}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
