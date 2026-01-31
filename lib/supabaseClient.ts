import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ADDING THIS LINE TO CHECK IF KEYS ARE FOUND:
console.log("Supabase URL Check:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey)