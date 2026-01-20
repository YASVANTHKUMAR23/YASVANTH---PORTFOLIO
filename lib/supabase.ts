import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof process !== 'undefined' && process.env.SUPABASE_URL) || '';
const supabaseKey = (typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials missing (Detected at runtime).');
    if (typeof window !== 'undefined') {
        console.error('Browser Context: Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are defined in vite.config.ts or as environment variables.');
    } else {
        console.error('Node Context: Ensure .env is loaded (import "dotenv/config") at the script entry point.');
    }
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
