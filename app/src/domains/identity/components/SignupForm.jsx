import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function SignupForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signUp, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (nickname.length < 2 || nickname.length > 20) {
      setError('닉네임은 2~20자로 입력해주세요.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    const { error: err } = await signUp({ email, password, nickname })
    if (err) {
      setError(err)
    } else {
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--sub)' }}>
          닉네임
        </label>
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
            focus:ring-2 focus:ring-[var(--primary)]/30"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          placeholder="2~20자 닉네임"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--sub)' }}>
          이메일
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
            focus:ring-2 focus:ring-[var(--primary)]/30"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          placeholder="이메일을 입력하세요"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--sub)' }}>
          비밀번호
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
            focus:ring-2 focus:ring-[var(--primary)]/30"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          placeholder="8자 이상"
          required
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm
          transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: 'var(--primary)' }}
      >
        {loading ? '가입 중...' : '회원가입'}
      </button>
    </form>
  )
}
