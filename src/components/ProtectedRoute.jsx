import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ログイン済みの場合のみ表示し、未ログインの場合はログイン画面へリダイレクトする
export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) return <p className="loading">読み込み中...</p>
  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
