import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// 環境変数の設定漏れに気付けるよう、起動時に明示的なエラーにする
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を .env に設定してください',
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
