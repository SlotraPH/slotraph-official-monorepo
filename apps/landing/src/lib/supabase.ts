import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
    console.error(
        '[Slotra] Missing Supabase env vars. ' +
        'Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your root .env file ' +
        'and that the dev server has been restarted.'
    );
}

export const supabase = createClient(url || 'http://localhost', key || 'placeholder');
