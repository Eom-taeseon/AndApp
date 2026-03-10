import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const [email, setEmail] = useState('demo@fonsle.kr')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { error: err } = await signIn({ email, password })
    if (err) {
      setError(err)
    } else {
      navigate('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="비밀번호를 입력하세요"
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
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
