import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ntavlsbukomfjpqrwiii.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.publishable_key ||
  'sb_publishable_biBQaTjk4iiTb8xrWDXPTw_ulyhWzTi';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
