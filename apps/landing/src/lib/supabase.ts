import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !key) {
  throw new Error(
    'Missing Supabase env vars for landing app. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in apps/landing/.env.'
  );
}

export const supabase = createClient(url, key);
