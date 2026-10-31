import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ログイン画面・会員登録画面用。ログインが完了すると物件一覧画面へ遷移する
export default function PublicOnlyRoute() {
  const { session, loading } = useAuth()

  if (loading) return <p className="loading">読み込み中...</p>
  if (session) return <Navigate to="/properties" replace />

  return <Outlet />
}
