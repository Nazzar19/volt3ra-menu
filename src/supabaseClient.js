import { createClient } from '@supabase/supabase-js'

// Ambil dari Supabase Dashboard > Project Settings > API
// Taruh di file .env di root project (Vite) sebagai:
// VITE_SUPABASE_URL=https://xxxxx.supabase.co
// VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
