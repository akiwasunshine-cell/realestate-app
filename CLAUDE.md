# realestate-app

Supabase認証付きの不動産管理Webアプリ。物件データは現時点ではダミー（`src/data/properties.js`）。

## 技術スタック

React + Vite（JavaScript）、React Router、Supabase（`@supabase/supabase-js`）

## コマンド

- `npm run dev`: 開発サーバーを起動する
- `npm run build`: 本番用にビルドする

テストは未導入。

## セットアップ

`.env.example` を `.env` にコピーし、SupabaseのProject URLとPublishable keyを設定する。

## 構成

- `src/contexts/AuthContext.jsx`: ログイン状態の共有
- `src/components/`: `ProtectedRoute`（要ログイン）と `PublicOnlyRoute`（ログイン済みなら物件一覧へ転送）。ログイン後やログアウト後の画面遷移はこの2つが担うため、各ページでは遷移処理を書かない
- `src/pages/`: ログイン、会員登録、物件一覧の各画面
- `src/lib/authErrors.js`: Supabaseのエラーコードと日本語メッセージの対応表

## コーディング規約

- コメントは日本語で記載する。

## Git運用ルール

- コードを変更するたびに、コミットしてGitHubにプッシュする。ユーザーからの個別の指示は待たない。
- 変更内容が分かるコミットメッセージを書き、関連のない変更は別のコミットに分ける。
- `.env`、APIキー、パスワードなどの機密情報はコミットしない。
- プッシュに失敗した場合やリモートが未設定の場合は、そのことをユーザーに報告する。リモートの新規作成や `git push --force` は、ユーザーの確認を得てから行う。
