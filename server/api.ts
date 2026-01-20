import { PortfolioDatabase } from '../db/database.js';
import { DatabaseMigrator } from '../db/migrate.js';
import { DatabaseSeeder } from '../db/seed.js';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'db', 'portfolio.db');

// Ensure db directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

let db: PortfolioDatabase;

// Initialize database with migrations and seeding
async function initializeDatabase() {
  // Run migrations
  const migrator = new DatabaseMigrator();
  await migrator.runMigrations();
  migrator.close();

  // Initialize main database
  db = new PortfolioDatabase();
  
  // Seed database if empty
  const projectsCount = db.getAllProjects().length;
  if (projectsCount === 0) {
    const seeder = new DatabaseSeeder();
    seeder.seedData();
    seeder.close();
  }
}

// Initialize on module load
initializeDatabase().catch(console.error);

export { db };
