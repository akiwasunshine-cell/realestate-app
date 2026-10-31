import { supabase } from './supabaseClient'

// 対象ユーザーの絞り込みはRLSが行うため、ここでは user_id を指定しない

export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select()
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createProperty(values) {
  const { data, error } = await supabase
    .from('properties')
    .insert(values)
    .select()
    .single()

  if (error) throw error
  return data
}

// 対象行が見つからない場合も single() によりエラーになる（更新・削除で共通）
export async function updateProperty(id, values) {
  const { data, error } = await supabase
    .from('properties')
    .update(values)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProperty(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
}
