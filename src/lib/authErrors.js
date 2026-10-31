// Supabaseのエラーコードと画面に表示する日本語メッセージの対応表
const MESSAGES = {
  invalid_credentials: 'メールアドレスまたはパスワードが正しくありません。',
  email_not_confirmed: 'メールアドレスの確認が完了していません。確認メールのリンクを開いてください。',
  user_already_exists: 'このメールアドレスは既に登録されています。',
  email_exists: 'このメールアドレスは既に登録されています。',
  weak_password: 'パスワードが短いか、推測されやすい内容です。別のパスワードを入力してください。',
  email_address_invalid: 'このメールアドレスは使用できません。',
  signup_disabled: '現在、新規の会員登録は受け付けていません。',
  over_email_send_rate_limit: 'メールの送信回数が上限に達しました。しばらくしてからもう一度お試しください。',
  over_request_rate_limit: 'リクエストが多すぎます。しばらくしてからもう一度お試しください。',
}

const DEFAULT_MESSAGE = '処理に失敗しました。通信環境を確認して、もう一度お試しください。'

export function getAuthErrorMessage(error) {
  return MESSAGES[error.code] ?? DEFAULT_MESSAGE
}
