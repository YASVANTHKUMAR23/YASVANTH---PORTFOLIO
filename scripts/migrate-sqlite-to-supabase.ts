import 'dotenv/config';
import Database from 'better-sqlite3';
import { supabase } from '../lib/supabase.ts';
import path from 'path';


const DB_PATH = path.join(process.cwd(), 'db', 'portfolio.db');
const sqlite = new Database(DB_PATH);

async function migrate() {
    console.log('🚀 Starting data migration from SQLite to Supabase...');

    const tables = [
        'projects',
        'certificates',
        'experience',
        'skills',
        'site_settings',
        'social_links',
        'page_headers',
        'philosophy',
        'animated_titles'
    ];

    for (const table of tables) {
        console.log(`📦 Migrating table: ${table}...`);

        try {
            const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();

            if (rows.length === 0) {
                console.log(`  - No data found in ${table}. Skipping.`);
                continue;
            }

            // Clean up rows for PostgreSQL (e.g., handle boolean conversion if needed, though better-sqlite3 handles it okay usually)
            // SQLite featured=1/0 -> PostgreSQL boolean
            const cleanedRows = rows.map((row: any) => {
                const cleaned = { ...row };
                // SQLite doesn't have native boolean, it uses 0/1. 
                // We should check columns that are boolean in PG.
                if (table === 'projects' && cleaned.featured !== undefined) {
                    cleaned.featured = !!cleaned.featured;
                }
                return cleaned;
            });

            const conflictColumns: Record<string, string> = {
                'skills': 'name',
                'site_settings': 'key',
                'social_links': 'platform',
                'page_headers': 'page_name',
                'philosophy': 'line_number'
            };

            // If we have a business key conflict target, remove 'id' from the row
            // to let Supabase handle the PK and avoid "duplicate key value violates unique constraint" on 'id'
            const rowsToUpsert = cleanedRows.map((row: any) => {
                if (conflictColumns[table]) {
                    const { id, ...rest } = row;
                    return rest;
                }
                return row;
            });

            const { error } = await supabase
                .from(table)
                .upsert(rowsToUpsert, {
                    onConflict: conflictColumns[table] || 'id'
                });

            if (error) {
                console.error(`  ❌ Error migrating ${table}:`, error.message);
            } else {
                console.log(`  ✅ Successfully migrated ${rows.length} rows to ${table}.`);
            }
        } catch (err: any) {
            console.error(`  ❌ Failed to process table ${table}:`, err.message);
        }
    }

    console.log('🏁 Migration finished.');
}

migrate()
    .catch(err => {
        console.error('Fatal Migration Error:', err);
    })
    .finally(() => {
        sqlite.close();
    });
