import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper para queries SQL diretas
export const query = async (sql, params = []) => {
  const { data, error } = await supabase.rpc('execute_sql', {
    query: sql,
    params
  })
  
  if (error) throw error
  return data
}