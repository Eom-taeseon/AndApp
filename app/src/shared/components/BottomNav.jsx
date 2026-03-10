import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: '🏠', label: '홈' },
  { to: '/search', icon: '🔍', label: '검색' },
  { to: '/review/new', icon: '✏️', label: '리뷰' },
  { to: '/profile', icon: '👤', label: '마이' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50"
      style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-md mx-auto flex justify-around py-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors
               ${isActive ? 'text-[var(--primary)]' : 'text-[var(--sub)]'}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
