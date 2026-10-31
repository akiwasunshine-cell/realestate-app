import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuthErrorMessage } from '../lib/authErrors'
import { supabase } from '../lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setSubmitting(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // 確認メールのリンクを開いた後にこのアプリへ戻す
      options: { emailRedirectTo: window.location.origin },
    })

    if (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } else if (data.user?.identities?.length === 0) {
      // メール確認が有効な場合、登録済みのメールアドレスはエラーにならず identities が空で返る
      setErrorMessage(getAuthErrorMessage({ code: 'user_already_exists' }))
    } else if (!data.session) {
      // メール確認が有効な場合はセッションが発行されない
      setSuccessMessage('確認メールを送信しました。メール内のリンクを開いて登録を完了してください。')
    }
    // セッションが発行された場合は PublicOnlyRoute が物件一覧画面へ遷移させる
    setSubmitting(false)
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>

        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">パスワード（6文字以上）</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {errorMessage && <p className="message error" role="alert">{errorMessage}</p>}
        {successMessage && <p className="message success" role="status">{successMessage}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '会員登録'}
        </button>

        <p className="auth-link">
          既にアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </form>
    </main>
  )
}
