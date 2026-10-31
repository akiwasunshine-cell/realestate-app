import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { properties } from '../data/properties'
import { supabase } from '../lib/supabaseClient'

export default function PropertiesPage() {
  const { session } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')

  // 成功時は ProtectedRoute がログイン画面へリダイレクトする
  async function handleLogout() {
    setErrorMessage('')
    const { error } = await supabase.auth.signOut()
    if (error) setErrorMessage('ログアウトに失敗しました。もう一度お試しください。')
  }

  return (
    <>
      <header className="app-header">
        <span className="app-title">不動産管理</span>
        <div className="app-user">
          <span className="user-email">{session.user.email}</span>
          <button type="button" className="logout-button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <main className="properties-page">
        <h1>物件一覧</h1>
        {errorMessage && <p className="message error" role="alert">{errorMessage}</p>}

        <ul className="property-grid">
          {properties.map((property) => (
            <li key={property.id} className="property-card">
              <h2>{property.name}</h2>
              <p className="property-rent">
                <span className="property-label">家賃</span>
                {property.rent.toLocaleString('ja-JP')}円
              </p>
              <p className="property-area">
                <span className="property-label">エリア</span>
                {property.area}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
