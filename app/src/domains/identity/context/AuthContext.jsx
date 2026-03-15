import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ─── 앱 시작 시 세션 복원 ───
  useEffect(() => {
    authService.getCurrentUser()
      .then(profile => {
        setUser(profile)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })

    const subscription = authService.onAuthStateChange(profile => {
      setUser(profile)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ─── 로그인 ───
  const signIn = useCallback(async ({ email, password }) => {
    setLoading(true)
    try {
      const result = await authService.signIn({ email, password })
      if (result.user) {
        setUser(result.user)
      }
      return result
    } catch {
      return { user: null, error: '로그인 중 오류가 발생했습니다.' }
    } finally {
      setLoading(false)
    }
  }, [])

  // ─── 회원가입 ───
  const signUp = useCallback(async ({ email, password, nickname }) => {
    setLoading(true)
    try {
      const result = await authService.signUp({ email, password, nickname })
      if (result.user) {
        setUser(result.user)
      }
      return result
    } catch {
      return { user: null, error: '회원가입 중 오류가 발생했습니다.' }
    } finally {
      setLoading(false)
    }
  }, [])

  // ─── 로그아웃 ───
  const signOut = useCallback(async () => {
    await authService.signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.')
  return ctx
}
