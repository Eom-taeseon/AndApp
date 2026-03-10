import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase, isMockMode } from '../../../shared/lib/supabase'
import { MOCK_USERS } from '../../../shared/lib/mock-data'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // 초기 세션 확인 중

  // ─── 앱 시작 시 세션 복원 ───
  useEffect(() => {
    if (isMockMode) {
      setLoading(false)
      return
    }

    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          setUser(profile)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    // 인증 상태 변경 감지 (로그인/로그아웃/토큰갱신)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setUser(profile)
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // users 테이블에서 프로필 가져오기
  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('프로필 조회 실패:', error.message)
      return null
    }
    return data
  }

  // ─── 로그인 ───
  const signIn = useCallback(async ({ email, password }) => {
    if (isMockMode) {
      setLoading(true)
      await new Promise(r => setTimeout(r, 500))
      const found = MOCK_USERS.find(u => u.email === email)
      setLoading(false)
      if (found) {
        setUser(found)
        return { user: found, error: null }
      }
      return { user: null, error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      return { user: null, error: error.message }
    }

    const profile = await fetchProfile(data.user.id)
    setUser(profile)
    return { user: profile, error: null }
  }, [])

  // ─── 회원가입 ───
  const signUp = useCallback(async ({ email, password, nickname }) => {
    if (isMockMode) {
      setLoading(true)
      await new Promise(r => setTimeout(r, 500))
      const newUser = {
        id: `u${Date.now()}`,
        email,
        nickname,
        profile_image: null,
        created_at: new Date().toISOString(),
      }
      setUser(newUser)
      setLoading(false)
      return { user: newUser, error: null }
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname }, // 트리거에서 users 테이블에 닉네임 자동 저장
      },
    })
    setLoading(false)

    if (error) {
      return { user: null, error: error.message }
    }

    // 이메일 인증이 필요한 경우
    if (data.user && !data.session) {
      return {
        user: null,
        error: null,
        needsEmailConfirm: true,
        message: '인증 메일을 확인해주세요!',
      }
    }

    return { user: data.user, error: null }
  }, [])

  // ─── 로그아웃 ───
  const signOut = useCallback(async () => {
    if (isMockMode) {
      setUser(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.')
  return ctx
}
