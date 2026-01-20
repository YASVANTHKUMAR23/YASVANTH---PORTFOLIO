import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db', 'portfolio.db');
const MIGRATIONS_DIR = path.join(process.cwd(), 'db', 'migrations');

interface Migration {
  name: string;
  applied_at: string;
}

export class DatabaseMigrator {
  private db: DatabaseType;
  private migrationsDir: string;

  constructor(dbPath: string = DB_PATH, migrationsDir: string = MIGRATIONS_DIR) {
    this.db = new Database(dbPath);
    this.migrationsDir = migrationsDir;
    this.initialize();
  }

  private initialize(): void {
    // Create migrations table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  public runMigrations(): void {
    const appliedMigrations = this.getAppliedMigrations();
    const migrationFiles = this.getMigrationFiles();

    console.log("📂 Migration files found:", migrationFiles);

    for (const file of migrationFiles) {
      const migrationName = path.basename(file, '.sql');

      // Skip already applied migrations
      if (appliedMigrations.some(m => m.name === migrationName)) {
        console.log(`✓ Migration ${migrationName} already applied`);
        continue;
      }

      try {
        const sql = fs.readFileSync(file, 'utf8');
        console.log(`➡️ Applying migration: ${migrationName}`);
        console.log(sql); // show the SQL being executed

        this.db.exec(sql);

        // Record the migration
        const stmt = this.db.prepare('INSERT INTO migrations (name) VALUES (?)');
        stmt.run(migrationName);

        console.log(`✅ Applied migration: ${migrationName}`);
      } catch (error) {
        console.error(`❌ Failed to apply migration ${migrationName}:`, error);
        throw error;
      }
    }
  }

  public getAppliedMigrations(): Migration[] {
    const stmt = this.db.prepare('SELECT name, applied_at FROM migrations ORDER BY applied_at');
    return stmt.all() as Migration[];
  }

  private getMigrationFiles(): string[] {
    return fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => path.join(this.migrationsDir, file))
      .sort((a, b) => a.localeCompare(b));
  }

  public close(): void {
    this.db.close();
  }
}

// Run migrations if executed directly (ESM-compatible check)
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  const migrator = new DatabaseMigrator();
  try {
    migrator.runMigrations();
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    migrator.close();
  }
}
// Always run migrations when this file is executed
const migrator = new DatabaseMigrator();
try {
  migrator.runMigrations();
  console.log('All migrations completed successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
} finally {
  migrator.close();
}