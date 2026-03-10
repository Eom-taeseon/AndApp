import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './domains/identity/context/AuthContext'
import BottomNav from './shared/components/BottomNav'
import TopHeader from './shared/components/TopHeader'

// Pages
import FeedPage from './domains/discovery/components/FeedPage'
import SearchPage from './domains/discovery/components/SearchPage'
import RestaurantDetailPage from './domains/discovery/components/RestaurantDetailPage'
import ReviewForm from './domains/review/components/ReviewForm'
import AuthPage from './domains/identity/components/AuthPage'
import ProfilePage from './pages/ProfilePage'

function AppLayout() {
  const location = useLocation()

  // 인증 페이지는 별도 레이아웃
  if (location.pathname === '/auth') {
    return <AuthPage />
  }

  // 맛집 상세는 자체 헤더 포함
  const noHeader = location.pathname.startsWith('/restaurant/')

  // 각 페이지별 타이틀
  const titles = {
    '/': null, // 홈은 TopHeader 내부에서 '폰슐랭' 표시
    '/search': '맛집 검색',
    '/review/new': '리뷰 작성',
    '/profile': '마이페이지',
  }

  return (
    <div className="max-w-md mx-auto min-h-screen" style={{ background: 'var(--bg)' }}>
      {!noHeader && <TopHeader title={titles[location.pathname]} />}

      <main className="pt-2">
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/review/new" element={<ReviewForm />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  )
}
