-- Add page headers table
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS page_headers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_name TEXT NOT NULL UNIQUE,
  eyebrow TEXT,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial page headers
INSERT OR IGNORE INTO page_headers (page_name, eyebrow, title, description) VALUES
('about', 'Personal Narrative', 'Engineering Excellence Since 2018', 'I am a digital architect obsessed with performance and minimalist aesthetics.'),
('projects', 'Archive', 'Digital Artifacts', 'A comprehensive overview of engineering challenges tackled and elegance achieved. Updated in real-time.'),
('certificates', 'Validation', 'Verified Expertise', 'A verified list of professional credentials and academic milestones.'),
('contact', 'Get in touch', 'Contact Me', 'Whether you have a question, a project idea, or just want to say hi, my inbox is always open.'),
('experience', 'Career Journey', 'Professional Milestones', 'A timeline of technical leadership and product engineering.'),
('skills', 'Tooling & Mastery', 'Current Arsenal', 'A breakdown of the technologies I use to build the future.');

COMMIT;
