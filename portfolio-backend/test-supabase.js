import 'dotenv/config';
import { supabaseAdmin } from './lib/supabase.js';

async function testConnection() {
    console.log('--- Supabase Connection Test ---');
    console.log('Testing SUPABASE_URL:', process.env.SUPABASE_URL ? 'PRESENT' : 'MISSING');
    console.log('Testing SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PRESENT' : 'MISSING');

    const tables = ['hero', 'about', 'projects', 'certificates', 'blogs', 'contact', 'stats'];

    for (const table of tables) {
        console.log(`\nChecking table: ${table}...`);
        const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);

        if (error) {
            console.error(`❌ Error in ${table}:`, error.message);
        } else {
            console.log(`✅ Table ${table} connected successfully. Count: ${data.length}`);
        }
    }

    console.log('\n--- Test Complete ---');
}

testConnection().catch(console.error);
