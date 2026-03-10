import { useNavigate, useLocation } from 'react-router-dom'

export default function TopHeader({ title, showBack = false }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isHome = location.pathname === '/'
  const displayTitle = title || (isHome ? '폰슐랭' : '')

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b z-40 px-4 py-3"
      style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-md mx-auto flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)}
            className="text-lg hover:opacity-70 transition-opacity">
            ←
          </button>
        )}
        <h1 className={`font-bold flex-1 ${isHome ? 'text-xl' : 'text-lg'}`}
          style={{ color: isHome ? 'var(--primary)' : 'var(--text)' }}>
          {displayTitle}
        </h1>
      </div>
    </header>
  )
}
