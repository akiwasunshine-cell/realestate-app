-- 物件テーブル
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  -- 登録したユーザー。省略時はログイン中のユーザーが入り、ユーザーの削除時は物件も削除する
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  rent integer not null check (rent >= 0),
  area text not null check (char_length(trim(area)) > 0),
  layout text not null check (char_length(trim(layout)) > 0),
  created_at timestamptz not null default now()
);

create index properties_user_id_idx on public.properties (user_id);

-- ログイン済みユーザーにのみテーブルへのアクセスを許可する（対象行はRLSで制限する）
revoke all on public.properties from anon;
grant select, insert, update, delete on public.properties to authenticated;

-- RLSを有効にする
alter table public.properties enable row level security;

-- 自分が登録した物件のみ表示できる
create policy "自分の物件のみ表示できる"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 自分の物件としてのみ登録できる
create policy "自分の物件のみ登録できる"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- 自分の物件のみ編集でき、登録者を他のユーザーに変更することもできない
create policy "自分の物件のみ編集できる"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 自分の物件のみ削除できる
create policy "自分の物件のみ削除できる"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);
