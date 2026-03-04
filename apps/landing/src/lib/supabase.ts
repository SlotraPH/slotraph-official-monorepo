import { createClient } from '@supabase/supabase-js';

// These are injected at build time via Vite's define in astro.config.mjs,
// which reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the root .env.
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

const supabaseUrl = __SUPABASE_URL__.trim();
const supabaseAnonKey = __SUPABASE_ANON_KEY__.trim();

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
