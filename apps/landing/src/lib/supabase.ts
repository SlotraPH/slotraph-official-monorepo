import { createClient } from '@supabase/supabase-js';

// These are injected at build time via Vite's define in astro.config.mjs,
// which reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the root .env.
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

export const supabase = createClient(__SUPABASE_URL__, __SUPABASE_ANON_KEY__);
