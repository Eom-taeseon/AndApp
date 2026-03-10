import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경변수가 없으면 목 모드
export const isMockMode = !SUPABASE_URL || SUPABASE_URL === 'https://your-project.supabase.co'

// Supabase 클라이언트 생성
export const supabase = isMockMode
  ? null
  : createClient(SUPABASE_URL, SUPABASE_KEY)
