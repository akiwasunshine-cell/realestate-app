import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// ログイン状態をアプリ全体に共有する
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // 保存済みセッションの確認が終わるまでは、ログイン状態を判定しない
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 登録直後に現在のセッションが INITIAL_SESSION として通知される
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
