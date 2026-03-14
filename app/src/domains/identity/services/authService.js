import { supabase, isMockMode } from '../../../shared/lib/supabase'
import { MOCK_USERS } from '../../../shared/lib/mock-data'

// Anti-Corruption Layer: Supabase Auth SDK 호출을 캡슐화
export const authService = {
  async signUp({ email, password, nickname }) {
    if (isMockMode) {
      await new Promise(r => setTimeout(r, 500))
      const newUser = {
        id: `u${Date.now()}`,
        email,
        nickname,
        profile_image: null,
        created_at: new Date().toISOString(),
      }
      return { user: newUser, error: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    })

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
  },

  async signIn({ email, password }) {
    if (isMockMode) {
      await new Promise(r => setTimeout(r, 500))
      const found = MOCK_USERS.find(u => u.email === email)
      if (found) {
        return { user: found, error: null }
      }
      return { user: null, error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data.user, error: null }
  },

  async signOut() {
    if (isMockMode) return
    await supabase.auth.signOut()
  },

  async getCurrentUser() {
    if (isMockMode) return null

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null

    return await this.fetchProfile(session.user.id)
  },

  onAuthStateChange(callback) {
    if (isMockMode) return { unsubscribe: () => {} }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await authService.fetchProfile(session.user.id)
          callback(profile)
        } else {
          callback(null)
        }
      }
    )
    return subscription
  },

  async fetchProfile(userId) {
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
  },
}
