import { useEffect, useState } from 'react'
import PropertyForm from '../components/PropertyForm'
import { useAuth } from '../contexts/AuthContext'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'
import { supabase } from '../lib/supabaseClient'

export default function PropertiesPage() {
  const { session } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  // 再読み込みボタンで値を変え、一覧の取得をやり直す
  const [reloadCount, setReloadCount] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // 画面を離れた後に届いた結果は反映しない
    let ignore = false

    fetchProperties()
      .then((data) => {
        if (ignore) return
        setProperties(data)
        setLoadFailed(false)
      })
      .catch((error) => {
        if (ignore) return
        console.error(error)
        setLoadFailed(true)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [reloadCount])

  function handleReload() {
    setLoading(true)
    setReloadCount((count) => count + 1)
  }

  async function handleCreate(values) {
    const created = await createProperty(values)
    setProperties((current) => [created, ...current])
    setIsCreating(false)
  }

  async function handleUpdate(id, values) {
    const updated = await updateProperty(id, values)
    setProperties((current) =>
      current.map((property) => (property.id === id ? updated : property)),
    )
    setEditingId(null)
  }

  async function handleDelete(property) {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return

    setErrorMessage('')
    setDeletingId(property.id)
    try {
      await deleteProperty(property.id)
      setProperties((current) => current.filter(({ id }) => id !== property.id))
    } catch (error) {
      console.error(error)
      setErrorMessage('削除に失敗しました。もう一度お試しください。')
    } finally {
      setDeletingId(null)
    }
  }

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
        <div className="page-heading">
          <h1>物件一覧</h1>
          {!isCreating && (
            <button type="button" className="primary-button" onClick={() => setIsCreating(true)}>
              新規登録
            </button>
          )}
        </div>

        {errorMessage && <p className="message error" role="alert">{errorMessage}</p>}

        {isCreating && (
          <div className="property-card new-property">
            <PropertyForm
              title="物件の新規登録"
              submitLabel="登録する"
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        )}

        {loading && <p className="loading">読み込み中...</p>}

        {!loading && loadFailed && (
          <div className="load-error">
            <p className="message error" role="alert">物件の読み込みに失敗しました。</p>
            <button type="button" className="secondary-button" onClick={handleReload}>
              再読み込み
            </button>
          </div>
        )}

        {!loading && !loadFailed && properties.length === 0 && (
          <p className="empty-message">登録された物件はありません。</p>
        )}

        {!loading && !loadFailed && properties.length > 0 && (
          <ul className="property-grid">
            {properties.map((property) => (
              <li key={property.id} className="property-card">
                {editingId === property.id ? (
                  <PropertyForm
                    initialValues={property}
                    title="物件の編集"
                    submitLabel="更新する"
                    onSubmit={(values) => handleUpdate(property.id, values)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <h2>{property.name}</h2>
                    <p className="property-rent">
                      <span className="property-label">家賃</span>
                      {property.rent.toLocaleString('ja-JP')}円
                    </p>
                    <p className="property-detail">
                      <span className="property-label">エリア</span>
                      {property.area}
                    </p>
                    <p className="property-detail">
                      <span className="property-label">間取り</span>
                      {property.layout}
                    </p>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => setEditingId(property.id)}
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        disabled={deletingId === property.id}
                        onClick={() => handleDelete(property)}
                      >
                        {deletingId === property.id ? '削除中...' : '削除'}
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
