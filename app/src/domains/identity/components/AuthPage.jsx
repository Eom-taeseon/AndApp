import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

export default function AuthPage() {
  const [tab, setTab] = useState('login')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--bg)' }}>

      {/* 로고 */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--primary)' }}>
          폰슐랭
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--sub)' }}>
          나만의 맛집을 6각형으로 기록하세요
        </p>
      </div>

      {/* 탭 전환 */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm overflow-hidden"
        style={{ border: '1px solid var(--border)' }}>
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          {['login', 'signup'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors
                ${tab === t
                  ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                  : 'text-[var(--sub)]'}`}
            >
              {t === 'login' ? '로그인' : '회원가입'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'login' ? <LoginForm /> : <SignupForm onSuccess={() => setTab('login')} />}
        </div>
      </div>

      {/* 데모 안내 */}
      <p className="text-xs mt-6 text-center" style={{ color: 'var(--sub)' }}>
        데모 계정: demo@fonsle.kr / 아무 비밀번호
      </p>
    </div>
  )
}
